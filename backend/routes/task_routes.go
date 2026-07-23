package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/snehaamishraa/taskflow/backend/handlers"
	"github.com/snehaamishraa/taskflow/backend/middleware"
)

func SetupTaskRoutes(app *fiber.App) {

	taskHandler := handlers.NewTaskHandler()

	task := app.Group("/api/tasks", middleware.Protected())

	task.Post("/", taskHandler.CreateTask)
	task.Get("/", taskHandler.GetTasks)
	task.Put("/:id", taskHandler.UpdateTask)
	task.Delete("/:id", taskHandler.DeleteTask)
	task.Get("/search", taskHandler.SearchTasks)

	task.Get("/filter", taskHandler.FilterTasks)

	task.Get("/stats", taskHandler.DashboardStats)
}
