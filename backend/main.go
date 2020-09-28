package main

import (
	"context"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

// Handler
func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
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
