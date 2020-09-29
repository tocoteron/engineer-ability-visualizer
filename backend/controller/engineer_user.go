package controller

import (
	"log"
	"net/http"
	"strconv"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/tokoroten-lab/engineer-ability-visualizer/repository"
)

type EngineerUser struct {
	db *sqlx.DB
}

func NewEngineerUser(db *sqlx.DB) *EngineerUser {
	return &EngineerUser{db: db}
}

func (a *EngineerUser) GetAll(c echo.Context) error {
	user, err := repository.GetAllEngineerUsers(a.db)
	if err != nil {
		return c.String(http.StatusInternalServerError, "")
	}

	return c.JSON(http.StatusOK, user)
}

func (a *EngineerUser) Get(c echo.Context) error {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		log.Println(err)
		return c.String(http.StatusBadRequest, "Engineer user id is invalid")
	}

	user, err := repository.GetEngineerUser(a.db, id)
	if err != nil {
		return c.String(http.StatusInternalServerError, "")
	}

	return c.JSON(http.StatusOK, user)
}
