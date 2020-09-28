package model

type EngineerUser struct {
	ID          uint64
	FirebaseUID string
	GitHubToken string
	DisplayName string
	Email       string
	PhotoURL    string
}
