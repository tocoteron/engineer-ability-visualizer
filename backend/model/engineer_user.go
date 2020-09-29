package model

type EngineerUser struct {
	ID          uint64 `json:"id"`
	FirebaseUID string `json:"firebaseUID"`
	GitHubToken string `json:"githubToken"`
	DisplayName string `json:"displayName"`
	Email       string `json:"email"`
	PhotoURL    string `json:"photoURL"`
}
