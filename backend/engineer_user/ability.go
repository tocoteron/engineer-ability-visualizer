package engineer_user

import (
	"context"
	"fmt"
	"time"

	"github.com/google/go-github/v32/github"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
	"github.com/tokoroten-lab/engineer-ability-visualizer/repository"
	"golang.org/x/oauth2"
)

func CalcEngineerUserAbility(engineerUserID uint64) (*model.EngineerUserAbility, error) {
	engineerUser, err := repository.GetEngineerUser(engineerUserID)
	if err != nil {
		return nil, err
	}

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: engineerUser.GitHubToken},
	)
	tc := oauth2.NewClient(ctx, ts)

	githubClient := github.NewClient(tc)

	githubUser, err := getAuthenticatedUser(ctx, githubClient)
	if err != nil {
		return nil, err
	}

	githubUserEvents, err := getAuthenticatedUserEvents(ctx, githubClient, githubUser)
	if err != nil {
		return nil, err
	}

	projectPoint, err := calcProjectPoint(ctx, githubClient, githubUser)
	if err != nil {
		return nil, err
	}

	repositoryPoint, err := calcRepositoryPoint(ctx, githubClient, githubUser)
	if err != nil {
		return nil, err
	}

	commitPoint, err := calcCommitPoint(githubUserEvents)
	if err != nil {
		return nil, err
	}

	pullreqPoint, err := calcPullreqPoint(githubUserEvents)
	if err != nil {
		return nil, err
	}

	issuePoint, err := calcIssuePoint(githubUserEvents)
	if err != nil {
		return nil, err
	}

	speedPoint, err := calcSpeedPoint(ctx, githubClient, githubUser)
	if err != nil {
		return nil, err
	}

	ability := &model.EngineerUserAbility{
		ID:              0,
		EngineerUserID:  engineerUserID,
		ProjectPoint:    projectPoint,
		RepositoryPoint: repositoryPoint,
		CommitPoint:     commitPoint,
		PullreqPoint:    pullreqPoint,
		IssuePoint:      issuePoint,
		SpeedPoint:      speedPoint,
		CreatedAt:       time.Now(),
	}

	return ability, nil
}

func getAuthenticatedUser(ctx context.Context, githubClient *github.Client) (*github.User, error) {
	user, _, err := githubClient.Users.Get(ctx, "")
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
			false,
			listOptions,
		)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		res = append(res, events...)
	}

	return res, nil
}

func calcProjectPoint(ctx context.Context, client *github.Client, user *github.User) (uint64, error) {
	projects, _, err := client.Users.ListProjects(ctx, user.GetLogin(), nil)
	if err != nil {
		return 0, err
	}

	return uint64(len(projects)), nil
}

func calcRepositoryPoint(ctx context.Context, client *github.Client, user *github.User) (uint64, error) {
	repositories, _, err := client.Repositories.List(ctx, "", nil)
	if err != nil {
		return 0, err
	}

	return uint64(len(repositories)), nil
}

func calcCommitPoint(events []*github.Event) (uint64, error) {
	commits := []*github.Event{}

	for _, event := range events {
		if event.GetType() == "PushEvent" {
			commits = append(commits, event)
		}
	}

	return uint64(len(commits)), nil
}

func calcPullreqPoint(events []*github.Event) (uint64, error) {
	pullreqs := []*github.Event{}

	for _, event := range events {
		if event.GetType() == "PullRequestEvent" {
			pullreqs = append(pullreqs, event)
		}
	}

	return uint64(len(pullreqs)), nil
}

func calcIssuePoint(events []*github.Event) (uint64, error) {
	issues := []*github.Event{}

	for _, event := range events {
		eventType := event.GetType()
		if eventType == "IssuesEvent" || eventType == "IssueCommentEvent" {
			issues = append(issues, event)
		}
	}

	return uint64(len(issues)), nil
}

func calcSpeedPoint(ctx context.Context, client *github.Client, user *github.User) (uint64, error) {
	repositories, _, err := client.Repositories.List(ctx, "", nil)
	if err != nil {
		return 0, err
	}

	speedPoint := 0.0

	for _, repository := range repositories {
		commits, resp, err := client.Repositories.ListCommits(
			ctx,
			repository.GetOwner().GetLogin(),
			repository.GetName(),
			nil,
		)
		if err != nil {
			// 409 means "Git Repository is empty"
			if resp.StatusCode != 409 {
				return 0, err
			}
		}

		if len(commits) >= 2 {
			duration := calcDurationBetween2Commits(
				commits[len(commits)-1].GetCommit(),
				commits[0].GetCommit(),
			)
			speedPoint += float64(len(commits)) / duration.Hours()
		}
	}

	return uint64(speedPoint), nil
}

func calcDurationBetween2Commits(first *github.Commit, last *github.Commit) time.Duration {
	return last.GetCommitter().GetDate().Sub(first.GetCommitter().GetDate())
}
