package firebase

import (
	"context"

	"google.golang.org/api/option"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
)

func InitAuthClient(keyPath string) (*auth.Client, error) {
	opt := option.WithCredentialsFile(keyPath)
	fb, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, err
	}
	return fb.Auth(context.Background())
}
