package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/snehaamishraa/taskflow/backend/handlers"
)

func SetupAuthRoutes(app *fiber.App) {

	auth := app.Group("/api/auth")

	auth.Post("/signup", handlers.Signup)
	auth.Post("/login", handlers.Login)
	auth.Post("/verify-otp", handlers.VerifyOTP)
	auth.Post("/resend-otp", handlers.ResendOTP)

	// Browser navigations, not fetch calls: both ends of the OAuth round trip
	// are full-page redirects, so they are GET and answer with Location headers
	// rather than JSON.
	auth.Get("/google", handlers.GoogleLogin)
	auth.Get("/google/callback", handlers.GoogleCallback)
}