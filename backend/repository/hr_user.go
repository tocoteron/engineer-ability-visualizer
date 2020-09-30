package repository

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
)

func SyncHRUser(db *sqlx.DB, fu *model.FirebaseUser) (sql.Result, error) {
	return db.Exec(`
INSERT INTO hr_users (firebase_uid, email)
VALUES (?, ?)
ON DUPLICATE KEY
UPDATE email = ?
`, fu.FirebaseUID, fu.Email, fu.Email)
}

func GetHRUserByFirebaseUID(db *sqlx.DB, firebaseUID string) (*model.HRUser, error) {
	var hrUser model.HRUser

	if err := db.Get(&hrUser, `
SELECT id, firebase_uid, email, first_name, last_name, company_name
FROM hr_users
WHERE firebase_uid = ?
LIMIT 1
	`, firebaseUID); err != nil {
		return nil, err
	}

	return &hrUser, nil
}
