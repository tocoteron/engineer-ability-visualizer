package controller

import (
	"log"
	"net/http"
	"strconv"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/tokoroten-lab/engineer-ability-visualizer/engineer_user"
	"github.com/tokoroten-lab/engineer-ability-visualizer/repository"
)

type EngineerUserAbilityReport struct {
	db *sqlx.DB
}

func NewEngineerUserAbilityReport(db *sqlx.DB) *EngineerUserAbilityReport {
	return &EngineerUserAbilityReport{db: db}
}

func (a *EngineerUserAbilityReport) Create(c echo.Context) error {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		log.Println(err)
		return c.String(http.StatusBadRequest, "Engineer user id is invalid")
	}

	mockData, err := engineer_user.CalcEngineerUserAbility(a.db, id)
	if err != nil {
		log.Println(err)
		return c.String(http.StatusInternalServerError, "Calc engineer ability has failed")
	}

	return c.JSON(http.StatusOK, mockData)
}

func (a *EngineerUserAbilityReport) Get(c echo.Context) error {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		log.Println(err)
		return c.String(http.StatusBadRequest, "Engineer user id is invalid")
	}

	mockData, err := repository.GetEngineerUserAbilityReports(a.db, id)
	if err != nil {
		log.Println(err)
		return c.String(http.StatusInternalServerError, "Getting engineer ability has failed")
	}

	return c.JSON(http.StatusOK, mockData)
}
