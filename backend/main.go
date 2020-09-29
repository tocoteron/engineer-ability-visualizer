package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/tokoroten-lab/engineer-ability-visualizer/controller"
	"github.com/tokoroten-lab/engineer-ability-visualizer/engineer_user"
	"github.com/tokoroten-lab/engineer-ability-visualizer/repository"
)

func main() {
	databaseDatasource := os.Getenv("DATABASE_DATASOURCE")
	fmt.Println("DB_SOURCE:", os.Getenv("DATABASE_DATASOURCE"))

	db, err := sqlx.Open("mysql", databaseDatasource)
	if err != nil {
		panic(err)
	}

	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	engineerUserController := controller.NewEngineerUser(db)

	// Routes
	e.GET("/", hello)

	e.GET("/user/engineer", engineerUserController.GetAll)
	e.GET("/user/engineer/:id", engineerUserController.Get)
	e.GET("/user/engineer/:id/ability", getEngineerUserAbility)
	e.POST("/user/engineer/:id/ability", postEngineerUserAbility)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

// Handler
func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}

func getEngineerUserAbility(c echo.Context) error {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		log.Println(err)
		return c.String(http.StatusBadRequest, "Engineer user id is invalid")
	}

	mockData, err := repository.GetEngineerUserAbilityReports(id)
	if err != nil {
		log.Println(err)
		return c.String(http.StatusInternalServerError, "Getting engineer ability has failed")
	}

	return c.JSON(http.StatusOK, mockData)
}

func postEngineerUserAbility(c echo.Context) error {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		log.Println(err)
		return c.String(http.StatusBadRequest, "Engineer user id is invalid")
	}

	mockData, err := engineer_user.CalcEngineerUserAbility(id)
	if err != nil {
		log.Println(err)
		return c.String(http.StatusInternalServerError, "Calc engineer ability has failed")
	}

	return c.JSON(http.StatusOK, mockData)
}
