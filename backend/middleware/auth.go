package middleware

import (
	"errors"
	"log"
	"net/http"

	"firebase.google.com/go/auth"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
	"github.com/tokoroten-lab/engineer-ability-visualizer/repository"
)

const (
	bearer = "Bearer"
)

type Auth struct {
	client *auth.Client
	db     *sqlx.DB
}

func NewAuth(client *auth.Client, db *sqlx.DB) *Auth {
	return &Auth{
		client: client,
		db:     db,
	}
}

type FirebaseAuthContext struct {
	echo.Context
	HRUser *model.HRUser
}

func (auth *Auth) FirebaseAuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		idToken, err := getTokenFromHeader(c.Request())
		if err != nil {
			return err
		}

		token, err := auth.client.VerifyIDToken(c.Request().Context(), idToken)
		if err != nil {
			return err
		}

		userRecord, err := auth.client.GetUser(c.Request().Context(), token.UID)
		if err != nil {
			return err
		}

		firebaseUser := toFirebaseUser(userRecord)
		log.Println(firebaseUser)

		_, err = repository.SyncHRUser(auth.db, &firebaseUser)
		if err != nil {
			return err
		}
		log.Println("Complete sync hr_users")

		hrUser, err := repository.GetHRUserByFirebaseUID(auth.db, firebaseUser.FirebaseUID)
		if err != nil {
			return err
		}

		cc := &FirebaseAuthContext{
			c,
			hrUser,
		}

		return next(cc)
	}
}

func getTokenFromHeader(req *http.Request) (string, error) {
	header := req.Header.Get("Authorization")
	if header == "" {
		return "", errors.New("authorization header not found")
	}

	l := len(bearer)
	if len(header) > l+1 && header[:l] == bearer {
		return header[l+1:], nil
	}

	return "", errors.New("authorization header format must be 'Bearer {token}'")
}

func toFirebaseUser(u *auth.UserRecord) model.FirebaseUser {
	return model.FirebaseUser{
		FirebaseUID: u.UID,
		Email:       u.Email,
	}
}
