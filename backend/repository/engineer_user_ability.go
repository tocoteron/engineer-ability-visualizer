package repository

import (
	"time"

	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
)

func GetEngineerUserAbilities(engineerUserID uint64) ([]*model.EngineerUserAbility, error) {
	mockData := []*model.EngineerUserAbility{
		{
			ID:              0,
			EngineerUserID:  engineerUserID,
			ProjectScore:    0,
			RepositoryScore: 30,
			CommitScore:     70,
			PullreqScore:    46,
			IssueScore:      40,
			SpeedScore:      634,
			CreatedAt:       time.Now(),
		},
	}

	return mockData, nil
}
