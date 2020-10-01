package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/tokoroten-lab/engineer-ability-visualizer/model"

	_ "github.com/go-sql-driver/mysql"
	"github.com/google/go-github/v32/github"
	"github.com/jmoiron/sqlx"
	"golang.org/x/oauth2"
)

func initDBWithGitHub() (*sqlx.DB, *github.Client) {
	// DB
	databaseDatasource := os.Getenv("DATABASE_DATASOURCE")
	db, err := sqlx.Open("mysql", databaseDatasource+"?parseTime=true")
	if err != nil {
		panic(err)
	}

	// GitHub
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: os.Getenv("GITHUB_TOKEN")},
	)
	tc := oauth2.NewClient(context.Background(), ts)
	githubClient := github.NewClient(tc)

	return db, githubClient
}

func main() {
	db, github := initDBWithGitHub()

	abort := make(chan struct{})
	go func() {
		os.Stdin.Read(make([]byte, 1))
		abort <- struct{}{}
	}()

	tickDurationEnv := os.Getenv("BATCH_TICK_DURATION")
	tickDuration, err := strconv.ParseUint(tickDurationEnv, 10, 64)
	if err != nil {
		panic(errors.New("Invalid tick duration"))
	}

	ticker := time.NewTicker(time.Duration(tickDuration) * time.Second)
	for {
		select {
		case <-ticker.C:
			err := calcAllEngineersAbilityReports(db, github)
			if err != nil {
				fmt.Println(err)
			}

		case <-abort:
			fmt.Println("Launch aborted!")
			return
		}
	}
}

func calcAllEngineersAbilityReports(db *sqlx.DB, github *github.Client) error {
	engineerUsers, err := getAllEngineers(db)
	if err != nil {
		return err
	}
	fmt.Println(engineerUsers)

	for _, engineerUser := range engineerUsers {
		fmt.Println("TARGET", engineerUser.LoginName)

		ability, err := calcEngineerUserAbility(db, engineerUser)
		if err != nil {
			fmt.Println(err)
			continue
		}

		fmt.Println(ability)

		addEngineerUserAbilityReport(db, ability)
	}

	return nil
}

func getAllEngineers(db *sqlx.DB) ([]*model.EngineerUser, error) {
	engineerUsers := make([]*model.EngineerUser, 0)

	if err := db.Select(&engineerUsers, `
SELECT id, login_name, display_name, photo_url
FROM engineer_users
	`); err != nil {
		return nil, err
	}

	return engineerUsers, nil
}

func addEngineerUserAbilityReport(db *sqlx.DB, ability *model.EngineerUserAbilityReport) (sql.Result, error) {
	return db.Exec(`
INSERT
INTO engineer_users_ability_reports (
	engineer_users_id,
	project_score,
	repository_score,
	commit_score,
	pullreq_score,
	issue_score,
	speed_score
)
VALUES(?, ?, ?, ?, ?, ?, ?);
	`,
		ability.EngineerUserID,
		ability.ProjectScore,
		ability.RepositoryScore,
		ability.CommitScore,
		ability.PullreqScore,
		ability.IssueScore,
		ability.SpeedScore,
	)
}

func calcEngineerUserAbility(db *sqlx.DB, engineerUser *model.EngineerUser) (*model.EngineerUserAbilityReport, error) {
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: os.Getenv("GITHUB_TOKEN")},
	)
	tc := oauth2.NewClient(ctx, ts)

	githubClient := github.NewClient(tc)

	githubUser, err := getGitHubUser(ctx, githubClient, engineerUser.LoginName)
	if err != nil {
		return nil, err
	}

	githubUserEvents, err := geGitHubUserEvents(ctx, githubClient, githubUser)
	if err != nil {
		return nil, err
	}

	projectScore, err := calcProjectScore(ctx, githubClient, githubUser)
	if err != nil {
		return nil, err
	}
	fmt.Println("ProjectScore", projectScore)

	repositoryScore, err := calcRepositoryScore(ctx, githubClient, githubUser)
	if err != nil {
		return nil, err
	}
	fmt.Println("RepositoryScore", repositoryScore)

	commitScore, err := calcCommitScore(githubUserEvents)
	if err != nil {
		return nil, err
	}
	fmt.Println("CommitScore", commitScore)

	pullreqScore, err := calcPullreqScore(githubUserEvents)
	if err != nil {
		return nil, err
	}
	fmt.Println("PullreqScore", pullreqScore)

	issueScore, err := calcIssueScore(githubUserEvents)
	if err != nil {
		return nil, err
	}
	fmt.Println("IssueScore", issueScore)

	speedScore, err := calcSpeedScore(ctx, githubClient, githubUser)
	if err != nil {
		return nil, err
	}
	fmt.Println("SpeedScore", speedScore)

	ability := &model.EngineerUserAbilityReport{
		EngineerUserID:  engineerUser.ID,
		ProjectScore:    projectScore,
		RepositoryScore: repositoryScore,
		CommitScore:     commitScore,
		PullreqScore:    pullreqScore,
		IssueScore:      issueScore,
		SpeedScore:      speedScore,
	}

	return ability, nil
}

func getGitHubUser(ctx context.Context, githubClient *github.Client, loginName string) (*github.User, error) {
	user, _, err := githubClient.Users.Get(ctx, loginName)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func geGitHubUserEvents(ctx context.Context, client *github.Client, user *github.User) ([]*github.Event, error) {
	perPage := 100
	maxPageCount := 2

	res := []*github.Event{}

	for page := 1; page <= maxPageCount; page++ {
		listOptions := &github.ListOptions{
			PerPage: perPage,
			Page:    page,
		}

		events, resp, err := client.Activity.ListEventsPerformedByUser(
			ctx,
			user.GetLogin(),
			true,
			listOptions,
		)
		if err != nil {
			return nil, err
		}

		// All read
		if resp.NextPage == 0 {
			break
		}

		res = append(res, events...)
	}

	return res, nil
}

func calcProjectScore(ctx context.Context, client *github.Client, user *github.User) (uint64, error) {
	projects, _, err := client.Users.ListProjects(ctx, user.GetLogin(), nil)
	if err != nil {
		return 0, err
	}

	return uint64(len(projects)), nil
}

func calcRepositoryScore(ctx context.Context, client *github.Client, user *github.User) (uint64, error) {
	repositories, _, err := client.Repositories.List(ctx, user.GetLogin(), nil)
	if err != nil {
		return 0, err
	}

	return uint64(len(repositories)), nil
}

func calcCommitScore(events []*github.Event) (uint64, error) {
	commits := []*github.Event{}

	for _, event := range events {
		if event.GetType() == "PushEvent" {
			commits = append(commits, event)
		}
	}

	return uint64(len(commits)), nil
}

func calcPullreqScore(events []*github.Event) (uint64, error) {
	pullreqs := []*github.Event{}

	for _, event := range events {
		if event.GetType() == "PullRequestEvent" {
			pullreqs = append(pullreqs, event)
		}
	}

	return uint64(len(pullreqs)), nil
}

func calcIssueScore(events []*github.Event) (uint64, error) {
	issues := []*github.Event{}

	for _, event := range events {
		eventType := event.GetType()
		if eventType == "IssuesEvent" || eventType == "IssueCommentEvent" {
			issues = append(issues, event)
		}
	}

	return uint64(len(issues)), nil
}

func calcSpeedScore(ctx context.Context, client *github.Client, user *github.User) (uint64, error) {
	repositories, _, err := client.Repositories.List(ctx, user.GetLogin(), nil)
	if err != nil {
		return 0, err
	}

	speedScore := 0.0

	options := &github.CommitsListOptions{
		Author: user.GetLogin(),
	}

	for _, repository := range repositories {
		commits, resp, err := client.Repositories.ListCommits(
			ctx,
			repository.GetOwner().GetLogin(),
			repository.GetName(),
			options,
		)
		if err != nil {
			fmt.Println(resp.StatusCode)
			// 409 means "Git Repository is empty"
			if resp.StatusCode != 409 {
				continue
			}
		}

		if len(commits) >= 2 {
			duration := calcDurationBetween2Commits(
				commits[len(commits)-1].GetCommit(),
				commits[0].GetCommit(),
			)
			speedScore += float64(len(commits)) / duration.Hours()
		}
	}

	return uint64(speedScore), nil
}

func calcDurationBetween2Commits(first *github.Commit, last *github.Commit) time.Duration {
	return last.GetCommitter().GetDate().Sub(first.GetCommitter().GetDate())
}
