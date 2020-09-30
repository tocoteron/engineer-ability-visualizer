package repository

import (
	"github.com/jmoiron/sqlx"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
)

func CreateEngineerUserAndHRUserRelation(db *sqlx.DB, engineerUser *model.EngineerUser, hrUser *model.HRUser) (uint64, error) {
	res, err := db.Exec(`
INSERT INTO engineer_users_hr_users (engineer_users_id, hr_users_id)
VALUES (?, ?)
	`, engineerUser.ID, hrUser.ID)
	if err != nil {
		return 0, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}

	return uint64(id), nil
}
