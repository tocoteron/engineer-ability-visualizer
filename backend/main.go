package main

import (
	"fmt"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/tokoroten-lab/engineer-ability-visualizer/controller"
	"github.com/tokoroten-lab/engineer-ability-visualizer/firebase"
	mymiddleware "github.com/tokoroten-lab/engineer-ability-visualizer/middleware"
)

func main() {
	authClient, err := firebase.InitAuthClient("firebaseServiceAccountKey.json")
	if err != nil {
		panic(err)
	}

	databaseDatasource := os.Getenv("DATABASE_DATASOURCE")
	fmt.Println("DB_SOURCE:", os.Getenv("DATABASE_DATASOURCE"))

	db, err := sqlx.Open("mysql", databaseDatasource)
	if err != nil {
		panic(err)
	}

	/*
		mockEngineerUser := &model.EngineerUser{
			ID:          0,
			FirebaseUID: "tokorotenFirebaseUID",
			GitHubToken: os.Getenv("GITHUB_TOKEN"),
			LoginName:   "tokoroten-lab",
			DisplayName: "Tokoroten",
			Email:       "tokoroten.lab@gmail.com",
			PhotoURL:    "https://avatars3.githubusercontent.com/u/51188956?v=4",
		}
		_, err = repository.SyncEngineerUser(db, mockEngineerUser)
		if err != nil {
			panic(err)
		}
	*/

	// Controllers
	engineerUserController := controller.NewEngineerUser(db)
	engineerUserAbilityReportController := controller.NewEngineerUserAbilityReport(db)

	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	auth := mymiddleware.NewAuth(authClient, db)

	// Routes
	e.GET("/", hello, auth.FirebaseAuthMiddleware)

	e.GET("/user/engineer", engineerUserController.GetAll)
	e.GET("/user/engineer/:id", engineerUserController.Get)

	e.POST("/user/engineer/:id/ability", engineerUserAbilityReportController.Create)
	e.GET("/user/engineer/:id/ability", engineerUserAbilityReportController.Get)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

// Handler
func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}
