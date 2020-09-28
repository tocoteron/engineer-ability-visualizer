package engineer_user

import (
	"context"

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

	client := github.NewClient(tc)

	projectPoint, err := CalcProjectPoint(client)
	if err != nil {
		return nil, err
	}

	repositoryPoint, err := CalcRepositoryPoint(client)
	if err != nil {
		return nil, err
	}

	commitPoint, err := CalcCommitPoint(client)
	if err != nil {
		return nil, err
	}

	pullreqPoint, err := CalcPullreqPoint(client)
	if err != nil {
		return nil, err
	}

	issuePoint, err := CalcIssuePoint(client)
	if err != nil {
		return nil, err
	}

	speedPoint, err := CalcSpeedPoint(client)
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
	}

	return ability, nil
}

func CalcProjectPoint(githubClient *github.Client) (uint64, error) {
	return 10, nil
}

func CalcRepositoryPoint(githubClient *github.Client) (uint64, error) {
	return 20, nil
}

func CalcCommitPoint(githubClient *github.Client) (uint64, error) {
	return 30, nil
}

func CalcPullreqPoint(githubClient *github.Client) (uint64, error) {
	return 40, nil
}

func CalcIssuePoint(githubClient *github.Client) (uint64, error) {
	return 50, nil
}

func CalcSpeedPoint(githubClient *github.Client) (uint64, error) {
	return 60, nil
}
