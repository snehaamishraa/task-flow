package services

import (
	"errors"

	"github.com/snehaamishraa/taskflow/backend/models"
	"github.com/snehaamishraa/taskflow/backend/repositories"
	"github.com/snehaamishraa/taskflow/backend/utils"

	"gorm.io/gorm"
)

func Signup(req models.SignupRequest) error {

	// Check if email already exists
	_, err := repositories.GetUserByEmail(req.Email)

	if err == nil {
		return errors.New("email already exists")
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	// Hash Password
	hashedPassword, err := utils.HashPassword(req.Password)

	if err != nil {
		return err
	}

	user := models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
	}

	return repositories.CreateUser(&user)
}

func Login(req models.LoginRequest) (string, error) {

	user, err := repositories.GetUserByEmail(req.Email)

	if err != nil {
		return "", errors.New("invalid email or password")
	}

	err = utils.CheckPassword(req.Password, user.Password)

	if err != nil {
		return "", errors.New("invalid email or password")
	}

	token, err := utils.GenerateToken(user.ID)

	if err != nil {
		return "", err
	}

	return token, nil
}