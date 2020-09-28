package repository

import (
	"os"

	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
)

func GetEngineerUser(id uint64) (*model.EngineerUser, error) {
	mockData := &model.EngineerUser{
		ID:          id,
		FirebaseUID: "tokorotenFirebaseUID",
		GitHubToken: os.Getenv("GITHUB_TOKEN"),
		DisplayName: "Tokoroten",
		Email:       "tokoroten.lab@gmail.com",
		PhotoURL:    "https://avatars3.githubusercontent.com/u/51188956?v=4",
	}
	return mockData, nil
}

func GetEngineerUserFromFirebaseUID(firebaseUID string) (*model.EngineerUser, error) {
	mockData := &model.EngineerUser{
		ID:          0,
		FirebaseUID: firebaseUID,
		GitHubToken: os.Getenv("GITHUB_TOKEN"),
		DisplayName: "Tokoroten",
		Email:       "tokoroten.lab@gmail.com",
		PhotoURL:    "https://avatars3.githubusercontent.com/u/51188956?v=4",
	}
	return mockData, nil
}
