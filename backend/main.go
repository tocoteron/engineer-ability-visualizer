package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/tokoroten-lab/engineer-ability-visualizer/engineer_user"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
	"github.com/tokoroten-lab/engineer-ability-visualizer/repository"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", hello)

	e.GET("/user/engineer", getEngineerUsers)
	e.GET("/user/engineer/:id/ability", getEngineerUserAbility)
	e.POST("/user/engineer/:id/ability", postEngineerUserAbility)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

// Handler
func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}

func getEngineerUsers(c echo.Context) error {
	mockData, _ := repository.GetEngineerUserFromFirebaseUID("hogehgoeFirebaseUID")
	return c.JSON(http.StatusOK, []*model.EngineerUser{mockData})
}

func getEngineerUserAbility(c echo.Context) error {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		log.Println(err)
		return c.String(http.StatusBadRequest, "Engineer user id is invalid")
	}

	mockData, err := repository.GetEngineerUserAbilities(id)
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
