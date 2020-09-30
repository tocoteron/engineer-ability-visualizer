package controller

import (
	"context"
	"log"
	"net/http"

	"github.com/google/go-github/v32/github"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	mymiddleware "github.com/tokoroten-lab/engineer-ability-visualizer/middleware"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
	"github.com/tokoroten-lab/engineer-ability-visualizer/repository"
)

type HRUser struct {
	db     *sqlx.DB
	github *github.Client
}

func NewHRUser(db *sqlx.DB, github *github.Client) *HRUser {
	return &HRUser{
		db:     db,
		github: github,
	}
}

func (a *HRUser) AddEngineerToList(c echo.Context) error {
	cc := c.(*mymiddleware.FirebaseAuthContext)
	hrUser := cc.HRUser

	githubLoginName := c.Param("githubLoginName")
	githubUser, _, err := a.github.Users.Get(context.Background(), githubLoginName)
	if err != nil {
		return err
	}

	engineerUser := &model.EngineerUser{
		LoginName:   githubUser.GetLogin(),
		DisplayName: githubUser.GetName(),
		PhotoURL:    githubUser.GetAvatarURL(),
	}

	_, err = repository.SyncEngineerUser(a.db, engineerUser)
	if err != nil {
		return err
	}

	engineerUser, err = repository.GetEngineerUserFromLoginName(a.db, githubLoginName)
	if err != nil {
		return err
	}

	log.Println(engineerUser.ID, hrUser.ID)

	_, err = repository.CreateEngineerUserAndHRUserRelation(a.db, engineerUser, hrUser)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, engineerUser)
}
