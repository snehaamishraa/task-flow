package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/snehaamishraa/taskflow/backend/handlers"
	"github.com/snehaamishraa/taskflow/backend/middleware"
)

func SetupRoutes(app *fiber.App) {

	api := app.Group("/api")

	auth := api.Group("/auth")

	auth.Post("/signup", handlers.Signup)
	auth.Post("/login", handlers.Login)

	user := api.Group("/user")

	user.Use(middleware.Protected())

	user.Get("/profile", handlers.GetProfile)

}