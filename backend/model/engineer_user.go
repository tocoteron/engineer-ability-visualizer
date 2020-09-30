package model

type EngineerUser struct {
	ID          uint64 `db:"id" json:"id"`
	LoginName   string `db:"login_name" json:"loginName"`
	DisplayName string `db:"display_name" json:"displayName"`
	PhotoURL    string `db:"photo_url" json:"photoURL"`
}
