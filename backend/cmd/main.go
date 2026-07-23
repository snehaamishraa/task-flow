package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/snehaamishraa/taskflow/backend/config"
	"github.com/snehaamishraa/taskflow/backend/database"
	"github.com/snehaamishraa/taskflow/backend/routes"
)

func main() {

	config.LoadEnv()

	database.ConnectDB()

	app := fiber.New(fiber.Config{
		// Fiber defaults to a 4 KB header buffer, which the OAuth redirect
		// overruns: cookies are not isolated by port, so every cookie any app
		// on localhost has ever set is sent to this server too, and the browser
		// gets a bare "Request Header Fields Too Large" with no way to recover.
		ReadBufferSize: 16384,
	})

	app.Use(cors.New(cors.Config{
		// Comma-separated list is supported, so a deployed frontend can be
		// added via env without touching this file again.
		AllowOrigins: config.GetEnvOr(
			"http://localhost:3000",
			"CORS_ALLOWED_ORIGINS",
			"FRONTEND_URL",
		),
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,PUT,DELETE,PATCH",
		AllowCredentials: true,
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "TaskFlow API Running 🚀",
		})
	})

	routes.SetupRoutes(app)

	log.Println("🚀 Server running on http://localhost:8080")

	log.Fatal(app.Listen(":8080"))
}