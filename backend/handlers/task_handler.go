package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/snehaamishraa/taskflow/backend/models"
	"github.com/snehaamishraa/taskflow/backend/services"
)

type TaskHandler struct {
	service *services.TaskService
}

func NewTaskHandler() *TaskHandler {
	return &TaskHandler{
		service: services.NewTaskService(),
	}
}

func (h *TaskHandler) CreateTask(c *fiber.Ctx) error {

	userID := c.Locals("user_id").(uint)

	var req models.CreateTaskRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	task, err := h.service.CreateTask(userID, req)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(task)
}

func (h *TaskHandler) SearchTasks(c *fiber.Ctx) error {

	userID := c.Locals("user_id").(uint)

	search := c.Query("q")

	tasks, err := h.service.SearchTasks(userID, search)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(tasks)
}

func (h *TaskHandler) FilterTasks(c *fiber.Ctx) error {

	userID := c.Locals("user_id").(uint)

	status := c.Query("status")
	priority := c.Query("priority")

	tasks, err := h.service.FilterTasks(userID, status, priority)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(tasks)
}

func (h *TaskHandler) DashboardStats(c *fiber.Ctx) error {

	userID := c.Locals("user_id").(uint)

	stats, err := h.service.DashboardStats(userID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(stats)
}

func (h *TaskHandler) UpdateTask(c *fiber.Ctx) error {

	userID := c.Locals("user_id").(uint)

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task id",
		})
	}

	var req models.UpdateTaskRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	task, err := h.service.UpdateTask(userID, uint(id), req)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(task)
}

func (h *TaskHandler) DeleteTask(c *fiber.Ctx) error {

	userID := c.Locals("user_id").(uint)

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid task id",
		})
	}

	err = h.service.DeleteTask(userID, uint(id))

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Task deleted successfully",
	})
}

func (h *TaskHandler) GetTasks(c *fiber.Ctx) error {

	userID := c.Locals("user_id").(uint)

	tasks, err := h.service.GetTasks(userID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(tasks)
}