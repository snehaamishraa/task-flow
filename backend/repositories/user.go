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

	// Compared case-insensitively so rows created before addresses were
	// normalized are still found, and so nobody can register a second account
	// that differs only by capitalisation.
	err := database.DB.
		Where("LOWER(email) = LOWER(?)", email).
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

func GetUserByGoogleID(googleID string) (*models.User, error) {

	var user models.User

	err := database.DB.
		Where("google_id = ?", googleID).
		First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// UpdateUser persists changes to an existing user.
//
// Uses Save rather than Updates so a field being set back to its zero value
// (for example clearing a password) is written instead of silently skipped.
func UpdateUser(user *models.User) error {

	return database.DB.Save(user).Error
}
