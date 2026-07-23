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

func ConnectDB() {

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		config.GetEnv("DB_HOST"),
		config.GetEnv("DB_USER"),
		config.GetEnv("DB_PASSWORD"),
		config.GetEnv("DB_NAME"),
		config.GetEnv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	DB = db

	log.Println("✅ Database connected successfully")

	err = DB.AutoMigrate(&models.User{})

	if err != nil {
		log.Fatal("Migration Failed:", err)
	}

	log.Println("✅ User table migrated successfully")
}