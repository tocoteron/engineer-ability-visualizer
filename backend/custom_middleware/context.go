package custom_middleware

import (
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/tokoroten-lab/engineer-ability-visualizer/model"
)

type CustomContext struct {
	echo.Context
	DB           *sqlx.DB
	EngineerUser *model.EngineerUser
}
