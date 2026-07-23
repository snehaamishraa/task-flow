package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/snehaamishraa/taskflow/backend/handlers"
	"github.com/snehaamishraa/taskflow/backend/middleware"
)

func SetupUserRoutes(app *fiber.App) {

	user := app.Group("/api/user")

	user.Use(middleware.Protected())

	user.Get("/profile", handlers.GetProfile)
}