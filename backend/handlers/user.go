package handlers

import "github.com/gofiber/fiber/v2"

func GetProfile(c *fiber.Ctx) error {

	userID := c.Locals("user_id")

	return c.JSON(fiber.Map{
		"message": "Protected Route",
		"user_id": userID,
	})

}