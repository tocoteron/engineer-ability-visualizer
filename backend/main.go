package main

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

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
