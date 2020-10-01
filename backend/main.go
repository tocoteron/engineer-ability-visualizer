package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/google/go-github/v32/github"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/tokoroten-lab/engineer-ability-visualizer/controller"
	"github.com/tokoroten-lab/engineer-ability-visualizer/firebase"
	mymiddleware "github.com/tokoroten-lab/engineer-ability-visualizer/middleware"
	"golang.org/x/oauth2"
)

func main() {
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: os.Getenv("GITHUB_TOKEN")},
	)
	tc := oauth2.NewClient(context.Background(), ts)
	githubClient := github.NewClient(tc)

	authClient, err := firebase.InitAuthClient("firebaseServiceAccountKey.json")
	if err != nil {
		panic(err)
	}

	databaseDatasource := os.Getenv("DATABASE_DATASOURCE")
	fmt.Println("DB_SOURCE:", databaseDatasource)

	db, err := sqlx.Open("mysql", databaseDatasource+"?parseTime=true")
	if err != nil {
		panic(err)
	}

	// Controllers
	engineerUserController := controller.NewEngineerUser(db, githubClient)
	hrUserController := controller.NewHRUser(db, githubClient)
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

	// e.GET("/user/engineer", engineerUserController.GetAll)
	e.GET("/engineer_user/:id", engineerUserController.Get)
	e.POST("/engineer_user/:id/ability_reports", engineerUserAbilityReportController.Create)
	e.GET("/engineer_user/:id/ability_reports", engineerUserAbilityReportController.Get)

	e.GET("/hr_user/engineers", hrUserController.GetEngineerList, auth.FirebaseAuthMiddleware)
	e.POST("/hr_user/engineers/:githubLoginName", hrUserController.AddEngineerToList, auth.FirebaseAuthMiddleware)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

// Handler
func hello(c echo.Context) error {
	cc := c.(*mymiddleware.FirebaseAuthContext)

	fmt.Println("Unko")

	return c.JSON(http.StatusOK, cc.HRUser)
}
