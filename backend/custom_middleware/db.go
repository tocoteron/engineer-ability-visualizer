package custom_middleware

import (
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
)

func DBMIddleware(db *sqlx.DB) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := c.(*CustomContext)
			cc.DB = db
			return next(cc)
		}
	}
}
