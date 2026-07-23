package services

import (
	"errors"

	"github.com/snehaamishraa/taskflow/backend/models"
	"github.com/snehaamishraa/taskflow/backend/repositories"
	"github.com/snehaamishraa/taskflow/backend/utils"

	"gorm.io/gorm"
)

func Signup(req models.SignupRequest) (*models.AuthResponse, error) {

	// Shape check only — it stops "asdf" and "a@b", not fake@fake.fake.
	if !utils.IsValidEmail(req.Email) {
		return nil, errors.New("please enter a valid email address")
	}

	email := utils.NormalizeEmail(req.Email)

	// Case-insensitive so "Sneha@x.com" cannot register alongside "sneha@x.com".
	_, err := repositories.GetUserByEmail(email)

	if err == nil {
		return nil, errors.New("email already exists")
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	user := models.User{
		Name:  req.Name,
		Email: email,
		// Pointer because the column is nullable for Google-only accounts.
		Password: &hashedPassword,
	}

	if err := repositories.CreateUser(&user); err != nil {
		return nil, err
	}

	// Signed in immediately. Email verification was removed: delivering a code
	// needs a verified sending domain, and without one the mail provider will
	// only deliver to the account owner — which locked out every other user.
	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		Message: "Account created",
		Token:   token,
	}, nil
}

func Login(req models.LoginRequest) (*models.AuthResponse, error) {

	user, err := repositories.GetUserByEmail(utils.NormalizeEmail(req.Email))

	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// A Google-only account has no password to check. Say so plainly rather
	// than "invalid email or password", which would send the user in circles
	// trying a password that was never set.
	if user.Password == nil {
		return nil, errors.New("this account uses Google sign-in — continue with Google")
	}

	if err := utils.CheckPassword(req.Password, *user.Password); err != nil {
		return nil, errors.New("invalid email or password")
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		Message: "Login successful",
		Token:   token,
	}, nil
}
