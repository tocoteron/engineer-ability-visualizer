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
