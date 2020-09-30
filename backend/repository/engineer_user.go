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

func GetAllEngineerUsers(db *sqlx.DB) ([]*model.EngineerUser, error) {
	mockData := []*model.EngineerUser{
		{
			ID:          0,
			DisplayName: "Tokoroten",
			LoginName:   "tokoroten-lab",
			PhotoURL:    "https://avatars3.githubusercontent.com/u/51188956?v=4",
		},
	}
	return mockData, nil
}
