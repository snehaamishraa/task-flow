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

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE,PATCH",
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