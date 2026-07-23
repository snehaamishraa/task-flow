package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"

	"github.com/snehaamishraa/taskflow/backend/config"
)

func Protected() fiber.Handler {

	return func(c *fiber.Ctx) error {

		authHeader := c.Get("Authorization")

		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Missing authorization header",
			})
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

			return []byte(config.GetEnv("JWT_SECRET")), nil

		})

		if err != nil || !token.Valid {

			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Invalid token",
			})

		}

		claims := token.Claims.(jwt.MapClaims)

		c.Locals("user_id", uint(claims["user_id"].(float64)))

		return c.Next()

	}

}