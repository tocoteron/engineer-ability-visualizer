package repository

import (
	"github.com/jmoiron/sqlx"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
)

func SyncEngineerUser(db *sqlx.DB, eu *model.EngineerUser) (uint64, error) {
	res, err := db.Exec(`
INSERT INTO engineer_users (login_name, display_name, photo_url)
VALUES (?, ?, ?)
ON DUPLICATE KEY
UPDATE login_name = ?, display_name = ?, photo_url = ?
`,
		eu.LoginName, eu.DisplayName, eu.PhotoURL,
		eu.LoginName, eu.DisplayName, eu.PhotoURL,
	)
	if err != nil {
		return 0, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}

	return uint64(id), nil
}

func GetEngineerUser(db *sqlx.DB, id uint64) (*model.EngineerUser, error) {
	engineerUser := &model.EngineerUser{}

	if err := db.Get(engineerUser, `
SELECT id, login_name, display_name, photo_url
FROM engineer_users
WHERE id = ? LIMIT 1
	`, id); err != nil {
		return nil, err
	}

	return engineerUser, nil
}

func GetEngineerUserFromLoginName(db *sqlx.DB, loginName string) (*model.EngineerUser, error) {
	var engineerUser model.EngineerUser

	if err := db.Get(&engineerUser, `
SELECT id, login_name, display_name, photo_url
FROM engineer_users
WHERE login_name = ? LIMIT 1
	`, loginName); err != nil {
		return nil, err
	}

	return &engineerUser, nil
}

func GetAllEngineerUsersWithAbilityReportsByHRUserID(db *sqlx.DB, hrUserID uint64) ([]*model.EngineerUserWithLatestAbilityReport, error) {
	engineerUsersWithAbilityReports := make([]*model.EngineerUserWithLatestAbilityReport, 0)

	if err := db.Select(&engineerUsersWithAbilityReports, `
SELECT
    engineer_users.id,
    engineer_users.login_name,
    engineer_users.display_name,
    engineer_users.photo_url,
    reports.project_score,
    reports.repository_score,
    reports.commit_score,
    reports.pullreq_score,
    reports.issue_score,
    reports.speed_score
FROM
    engineer_users_hr_users
INNER JOIN
    engineer_users
ON
    engineer_users_hr_users.engineer_users_id = engineer_users.id
LEFT JOIN
    (
        SELECT t.*
        FROM engineer_users_ability_reports as t
        INNER JOIN (
            SELECT engineer_users_id, MAX(created_at) as created_at
            FROM engineer_users_ability_reports
            GROUP BY engineer_users_id
        ) as max_t
        ON t.engineer_users_id = max_t.engineer_users_id
        AND t.created_at = max_t.created_at
    ) as reports
ON
    engineer_users.id = reports.engineer_users_id
WHERE
    hr_users_id = ?;
	`, hrUserID); err != nil {
		return nil, nil
	}

	return engineerUsersWithAbilityReports, nil
}
