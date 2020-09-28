package repository

import (
	"os"

	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
)

func GetEngineerUser(id uint64) (*model.EngineerUser, error) {
	mockData := &model.EngineerUser{
		ID:          id,
		FirebaseUID: "hogehogeFirebaseUID",
		GitHubToken: os.Getenv("GITHUB_TOKEN"),
		DisplayName: "hoge",
		Email:       "hoge@hoge.com",
		PhotoURL:    "https://hoge.com/hoge.jpg",
	}
	return mockData, nil
}

func GetEngineerUserFromFirebaseUID(firebaseUID string) (*model.EngineerUser, error) {
	mockData := &model.EngineerUser{
		ID:          0,
		FirebaseUID: firebaseUID,
		GitHubToken: os.Getenv("GITHUB_TOKEN"),
		DisplayName: "hoge",
		Email:       "hoge@hoge.com",
		PhotoURL:    "https://hoge.com/hoge.jpg",
	}
	return mockData, nil
}
