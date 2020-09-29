package model

type EngineerUser struct {
	ID          uint64 `db:"id" json:"id"`
	FirebaseUID string `db:"firebase_uid" json:"firebaseUID"`
	GitHubToken string `db:"github_token" json:"githubToken"`
	LoginName   string `db:"login_name" json:"loginName"`
	DisplayName string `db:"display_name" json:"displayName"`
	Email       string `db:"email" json:"email"`
	PhotoURL    string `db:"photo_url" json:"photoURL"`
}
