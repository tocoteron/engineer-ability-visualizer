package engineer_user

import "github.com/tokoroten-lab/engineer-ability-visualizer/model"

func CalcEngineerUserAbility(engineerUserID uint64) (*model.EngineerUserAbility, error) {
	projectPoint, err := CalcProjectPoint()
	if err != nil {
		return nil, err
	}

	repositoryPoint, err := CalcRepositoryPoint()
	if err != nil {
		return nil, err
	}

	commitPoint, err := CalcCommitPoint()
	if err != nil {
		return nil, err
	}

	pullreqPoint, err := CalcPullreqPoint()
	if err != nil {
		return nil, err
	}

	issuePoint, err := CalcIssuePoint()
	if err != nil {
		return nil, err
	}

	speedPoint, err := CalcSpeedPoint()
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

func CalcProjectPoint() (uint64, error) {
	return 10, nil
}

func CalcRepositoryPoint() (uint64, error) {
	return 20, nil
}

func CalcCommitPoint() (uint64, error) {
	return 30, nil
}

func CalcPullreqPoint() (uint64, error) {
	return 40, nil
}

func CalcIssuePoint() (uint64, error) {
	return 50, nil
}

func CalcSpeedPoint() (uint64, error) {
	return 60, nil
}
