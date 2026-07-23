package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/snehaamishraa/taskflow/backend/handlers"
)

func SetupAuthRoutes(app *fiber.App) {

	auth := app.Group("/api/auth")

	auth.Post("/signup", handlers.Signup)
	auth.Post("/login", handlers.Login)
}