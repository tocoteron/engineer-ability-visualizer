package repository

import (
	"github.com/jmoiron/sqlx"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
)

func GetEngineerUserAbilityReports(db *sqlx.DB, engineerUserID uint64) ([]*model.EngineerUserAbilityReport, error) {
	engineerUserAbilityReports := make([]*model.EngineerUserAbilityReport, 0)

	if err := db.Select(&engineerUserAbilityReports, `
SELECT *
FROM engineer_users_ability_reports
WHERE engineer_users_id = ?
ORDER BY created_at DESC;
	`, engineerUserID); err != nil {
		return nil, err
	}

	return engineerUserAbilityReports, nil
}
