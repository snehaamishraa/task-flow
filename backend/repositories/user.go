package repositories

import (
	"github.com/snehaamishraa/taskflow/backend/database"
	"github.com/snehaamishraa/taskflow/backend/models"
)

func CreateUser(user *models.User) error {

	return database.DB.Create(user).Error
}

func GetUserByEmail(email string) (*models.User, error) {

	var user models.User

	err := database.DB.
		Where("email = ?", email).
		First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserByID(id uint) (*models.User, error) {

	var user models.User

	err := database.DB.
		First(&user, id).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}