package main

import (
	"context"
	"net/http"
	"os"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
	"github.com/tokoroten-lab/engineer-ability-visualizer/repository"
	"golang.org/x/oauth2"

	"github.com/google/go-github/v32/github"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", hello)
	e.GET("/test/github/orgs", testGetGitHubOrgs)
	e.GET("/test/github/repos", testGetGitHubPrivateRepos)

	e.GET("/user/engineer", getEngineerUsers)
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

func postEngineerUserAbility(c echo.Context) error {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		return c.String(http.StatusBadRequest, "Engineer user id is invalid")
	}

	mockData := model.EngineerUserAbility{
		ID:              0,
		EngineerUserID:  id,
		ProjectPoint:    10,
		RepositoryPoint: 20,
		CommitPoint:     30,
		PullreqPoint:    40,
		IssuePoint:      50,
		SpeedPoint:      60,
	}

	return c.JSON(http.StatusOK, mockData)
}

func testGetGitHubOrgs(c echo.Context) error {
	client := github.NewClient(nil)

	orgs, _, err := client.Organizations.List(context.Background(), "tokoroten-lab", nil)
	if err != nil {
		return c.String(http.StatusInternalServerError, "GitHub API calling has failed.")
	}

	return c.JSON(http.StatusOK, orgs)
}

func testGetGitHubPrivateRepos(c echo.Context) error {
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: os.Getenv("GITHUB_TOKEN")},
	)
	tc := oauth2.NewClient(ctx, ts)

	client := github.NewClient(tc)

	repos, _, err := client.Repositories.List(ctx, "", nil)
	if err != nil {
		c.String(http.StatusInternalServerError, "GitHub API calling has failed.")
		return err
	}

	return c.JSON(http.StatusOK, repos)
}
