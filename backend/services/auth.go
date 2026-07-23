package services

import (
	"errors"
	"time"

	"github.com/snehaamishraa/taskflow/backend/models"
	"github.com/snehaamishraa/taskflow/backend/repositories"
	"github.com/snehaamishraa/taskflow/backend/utils"

	"gorm.io/gorm"
)

const (
	// How long an emailed code stays usable.
	otpValidity = 10 * time.Minute

	// Minimum gap between sends, so the endpoint cannot be used to flood
	// somebody's inbox or burn the mail quota.
	otpResendCooldown = 60 * time.Second
)

// issueOTP generates a fresh code, stores its hash, and emails it.
//
// The user row is only updated after the mail is accepted: saving first would
// invalidate a working previous code even when the new one never arrived.
func issueOTP(user *models.User) error {
	code, err := utils.GenerateOTP()
	if err != nil {
		return err
	}

	hash, err := utils.HashOTP(code)
	if err != nil {
		return err
	}

	if err := SendOTPEmail(user.Email, user.Name, code); err != nil {
		return err
	}

	now := time.Now()
	expiry := now.Add(otpValidity)

	user.OTPHash = hash
	user.OTPExpiresAt = &expiry
	user.OTPSentAt = &now
	// Reset on every new code, or a user who fumbled the last one would start
	// the next attempt already locked out.
	user.OTPAttempts = 0

	return repositories.UpdateUser(user)
}

func Signup(req models.SignupRequest) (*models.AuthResponse, error) {

	// A shape check only — it stops "asdf" and "a@b", not fake@fake.fake.
	// Proving the inbox exists is what the emailed code does.
	if !utils.IsValidEmail(req.Email) {
		return nil, errors.New("please enter a valid email address")
	}

	email := utils.NormalizeEmail(req.Email)

	existing, err := repositories.GetUserByEmail(email)

	if err == nil {
		// An account that never finished verification is not a real account
		// yet, so re-signing up resends the code instead of dead-ending on
		// "email already exists" with no way forward.
		if !existing.IsVerified && existing.Password != nil {
			if err := issueOTP(existing); err != nil {
				return nil, err
			}
			return &models.AuthResponse{
				Message:              "We sent a new verification code to your email",
				RequiresVerification: true,
				Email:                existing.Email,
			}, nil
		}
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
		Password:   &hashedPassword,
		IsVerified: false,
	}

	if err := repositories.CreateUser(&user); err != nil {
		return nil, err
	}

	if err := issueOTP(&user); err != nil {
		// The row exists but no code went out. Reporting the failure lets the
		// user retry, and the branch above turns that retry into a resend.
		return nil, errors.New("account created, but the verification email could not be sent — please try again")
	}

	return &models.AuthResponse{
		Message:              "Verification code sent to your email",
		RequiresVerification: true,
		Email:                user.Email,
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

	// Password is correct but the address was never proven. Send a fresh code
	// rather than issuing a token.
	if !user.IsVerified {
		if err := issueOTP(user); err != nil {
			return nil, errors.New("could not send your verification code — please try again")
		}
		return &models.AuthResponse{
			Message:              "Please verify your email — we sent you a code",
			RequiresVerification: true,
			Email:                user.Email,
		}, nil
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

func VerifyOTP(req models.VerifyOTPRequest) (*models.AuthResponse, error) {

	user, err := repositories.GetUserByEmail(utils.NormalizeEmail(req.Email))
	if err != nil {
		return nil, errors.New("invalid or expired code")
	}

	if user.IsVerified {
		// Already done — hand over a token rather than erroring, so a double
		// submit or a stale tab does not look like a failure.
		token, err := utils.GenerateToken(user.ID)
		if err != nil {
			return nil, err
		}
		return &models.AuthResponse{Message: "Email already verified", Token: token}, nil
	}

	if user.OTPHash == "" || user.OTPExpiresAt == nil {
		return nil, errors.New("no code was requested — please sign in again")
	}

	if time.Now().After(*user.OTPExpiresAt) {
		return nil, errors.New("that code has expired — request a new one")
	}

	if user.OTPAttempts >= utils.MaxOTPAttempts {
		return nil, errors.New("too many incorrect attempts — request a new code")
	}

	if err := utils.CheckOTP(req.Code, user.OTPHash); err != nil {
		user.OTPAttempts++
		// Persist the failure before returning, or the counter never rises and
		// the cap does nothing.
		_ = repositories.UpdateUser(user)
		return nil, errors.New("that code is not correct")
	}

	user.IsVerified = true
	// Clear the code so it cannot be replayed.
	user.OTPHash = ""
	user.OTPExpiresAt = nil
	user.OTPSentAt = nil
	user.OTPAttempts = 0

	if err := repositories.UpdateUser(user); err != nil {
		return nil, err
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{Message: "Email verified", Token: token}, nil
}

func ResendOTP(req models.ResendOTPRequest) (*models.AuthResponse, error) {

	user, err := repositories.GetUserByEmail(utils.NormalizeEmail(req.Email))
	if err != nil {
		// Deliberately vague: a distinct "no such account" reply would let
		// anyone enumerate which addresses are registered.
		return &models.AuthResponse{Message: "If that account exists, a new code is on its way"}, nil
	}

	if user.IsVerified {
		return &models.AuthResponse{Message: "That email is already verified"}, nil
	}

	if user.OTPSentAt != nil {
		if wait := otpResendCooldown - time.Since(*user.OTPSentAt); wait > 0 {
			return nil, errors.New("please wait a moment before requesting another code")
		}
	}

	if err := issueOTP(user); err != nil {
		return nil, errors.New("could not send the code — please try again")
	}

	return &models.AuthResponse{
		Message:              "A new code is on its way",
		RequiresVerification: true,
		Email:                user.Email,
	}, nil
}
