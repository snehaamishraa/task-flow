package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	log.Println("Environment variables loaded successfully")
}

func GetEnv(key string) string {
	return os.Getenv(key)
}

// GetEnvOr returns the first key that is set, falling back to the last value.
//
// Used so the Google credentials work whether they are named GOOGLE_CLIENT_ID
// or plain CLIENT_ID in .env, and so non-secret settings (redirect and
// frontend URLs) have working localhost defaults instead of failing silently.
func GetEnvOr(fallback string, keys ...string) string {
	for _, key := range keys {
		if value := os.Getenv(key); value != "" {
			return value
		}
	}
	return fallback
}
