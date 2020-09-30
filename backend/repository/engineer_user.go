package repository

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
)

func SyncEngineerUser(db *sqlx.DB, eu *model.EngineerUser) (sql.Result, error) {
	return db.Exec(`
INSERT INTO engineer_users (login_name, display_name, photo_url)
VALUES (?, ?, ?)
ON DUPLICATE KEY
UPDATE login_name = ?, display_name = ?, photo_url = ?
`,
		eu.LoginName, eu.DisplayName, eu.PhotoURL,
		eu.LoginName, eu.DisplayName, eu.PhotoURL,
	)
}

func GetEngineerUser(db *sqlx.DB, id uint64) (*model.EngineerUser, error) {
	/*
		engineerUser := &model.EngineerUser{}

		tif err := db.Get(engineerUser, `
		SELECT id, firebase_uid, github_token, email, login_name, display_name, photo_url WHERE id = ? LIMIT 1
		`, id); err != nil {
			return nil, err
		}

		return engineerUser, nil
	*/

	mockData := &model.EngineerUser{
		ID:          id,
		LoginName:   "tokoroten-lab",
		DisplayName: "Tokoroten",
		PhotoURL:    "https://avatars3.githubusercontent.com/u/51188956?v=4",
	}
	return mockData, nil
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

func GetEngineerUserFromFirebaseUID(firebaseUID string) (*model.EngineerUser, error) {
	mockData := &model.EngineerUser{
		ID:          0,
		DisplayName: "Tokoroten",
		LoginName:   "tokoroten-lab",
		PhotoURL:    "https://avatars3.githubusercontent.com/u/51188956?v=4",
	}
	return mockData, nil
}
