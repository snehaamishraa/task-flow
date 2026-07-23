package database

import (
	"fmt"
	"log"

	"github.com/snehaamishraa/taskflow/backend/config"
	"github.com/snehaamishraa/taskflow/backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// connectionString returns the DSN to open.
//
// Managed Postgres (Neon, Railway, Render, Supabase) hands out a single URL
// rather than separate parts, so that is preferred when present. The
// host/user/password variables remain the local-development path, so nobody
// has to change their .env.
func connectionString() string {
	if url := config.GetEnvOr("", "DATABASE_URL", "POSTGRES_URL"); url != "" {
		return url
	}

	// sslmode=disable suits a local Postgres. Hosted providers require TLS and
	// carry sslmode=require in their URL, which is why this branch is only for
	// the separate-variable form.
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		config.GetEnv("DB_HOST"),
		config.GetEnv("DB_USER"),
		config.GetEnv("DB_PASSWORD"),
		config.GetEnv("DB_NAME"),
		config.GetEnv("DB_PORT"),
		config.GetEnvOr("disable", "DB_SSLMODE"),
	)
}

func ConnectDB() {

	db, err := gorm.Open(postgres.Open(connectionString()), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	DB = db

	log.Println("✅ Database connected successfully")

	err = DB.AutoMigrate(
		&models.User{},
		&models.Task{},
	)

	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("✅ Tables migrated successfully")
}
