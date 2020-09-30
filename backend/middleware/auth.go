package middleware

import (
	"errors"
	"log"
	"net/http"

	"firebase.google.com/go/auth"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
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

func (auth *Auth) FirebaseAuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		idToken, err := getTokenFromHeader(c.Request())
		if err != nil {
			return err
		}

		log.Println("Bearer", idToken)

		return next(c)
	}
}

func (auth *Auth) Handler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		/*
			idToken, err := getTokenFromHeader(r)
			if err != nil {
				httputil.RespondErrorJson(w, http.StatusBadRequest, err)
				return
			}
			token, err := auth.client.VerifyIDToken(r.Context(), idToken)
			if err != nil {
				httputil.RespondErrorJson(w, http.StatusForbidden, err)
				return
			}
			userRecord, err := auth.client.GetUser(r.Context(), token.UID)
			if err != nil {
				httputil.RespondErrorJson(w, http.StatusInternalServerError, err)
				return
			}
			firebaseUser := toFirebaseUser(userRecord)
			_, syncErr := repository.SyncUser(auth.db, &firebaseUser)
			if syncErr != nil {
				httputil.RespondErrorJson(w, http.StatusInternalServerError, syncErr)
				return
			}

			user, err := repository.GetUser(auth.db, firebaseUser.FirebaseUID)
			if err != nil {
				log.Print(err.Error())
				httputil.RespondErrorJson(w, http.StatusInternalServerError, err)
				return
			}
			ctx := httputil.SetUserToContext(r.Context(), user)
			next.ServeHTTP(w, r.WithContext(ctx))
		*/
	})
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
