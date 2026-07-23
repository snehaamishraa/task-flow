package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/snehaamishraa/taskflow/backend/models"
	"github.com/snehaamishraa/taskflow/backend/services"
)

func Signup(c *fiber.Ctx) error {

	var req models.SignupRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	if req.Name == "" || req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "All fields are required",
		})
	}

	res, err := services.Signup(req)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(res)
}

func Login(c *fiber.Ctx) error {

	var req models.LoginRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	res, err := services.Login(req)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// 200 even when verification is still pending: the credentials were
	// accepted, the account just is not usable yet. The frontend branches on
	// requires_verification rather than on the status code.
	return c.JSON(res)
}

func VerifyOTP(c *fiber.Ctx) error {

	var req models.VerifyOTPRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	if req.Email == "" || req.Code == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Email and code are required",
		})
	}

	res, err := services.VerifyOTP(req)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(res)
}

func ResendOTP(c *fiber.Ctx) error {

	var req models.ResendOTPRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	if req.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Email is required",
		})
	}

	res, err := services.ResendOTP(req)

	if err != nil {
		// 429: the only failure this returns is the cooldown.
		return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(res)
}
