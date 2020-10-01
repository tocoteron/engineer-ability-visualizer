package controller

import (
	"net/http"
	"strconv"

	"github.com/google/go-github/v32/github"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/tokoroten-lab/engineer-ability-visualizer/repository"
)

type EngineerUser struct {
	db     *sqlx.DB
	github *github.Client
}

func NewEngineerUser(db *sqlx.DB, github *github.Client) *EngineerUser {
	return &EngineerUser{
		db:     db,
		github: github,
	}
}

func (a *EngineerUser) Get(c echo.Context) error {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		return err
	}

	user, err := repository.GetEngineerUser(a.db, id)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
}
