package engineer_user

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/google/go-github/v32/github"
	"github.com/jmoiron/sqlx"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
	"github.com/tokoroten-lab/engineer-ability-visualizer/repository"
	"golang.org/x/oauth2"
)

func CalcEngineerUserAbility(db *sqlx.DB, engineerUserID uint64) (*model.EngineerUserAbilityReport, error) {
	engineerUser, err := repository.GetEngineerUser(db, engineerUserID)
	if err != nil {
		return nil, err
	}

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

	githubUserEvents, err := getAuthenticatedUserEvents(ctx, githubClient, githubUser)
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
		ID:              0,
		EngineerUserID:  engineerUserID,
		ProjectScore:    projectScore,
		RepositoryScore: repositoryScore,
		CommitScore:     commitScore,
		PullreqScore:    pullreqScore,
		IssueScore:      issueScore,
		SpeedScore:      speedScore,
		CreatedAt:       time.Now(),
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

func getAuthenticatedUserEvents(ctx context.Context, client *github.Client, user *github.User) ([]*github.Event, error) {
	perPage := 100
	maxPageCount := 2

	res := []*github.Event{}

	for page := 1; page <= maxPageCount; page++ {
		listOptions := &github.ListOptions{
			PerPage: perPage,
			Page:    page,
		}

		events, _, err := client.Activity.ListEventsPerformedByUser(
			ctx,
			user.GetLogin(),
			true,
			listOptions,
		)
		if err != nil {
			fmt.Println("UNKO", err)
			return nil, err
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
