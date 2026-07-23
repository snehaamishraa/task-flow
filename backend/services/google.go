package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"golang.org/x/oauth2"
	googleoauth "golang.org/x/oauth2/google"

	"github.com/snehaamishraa/taskflow/backend/config"
	"github.com/snehaamishraa/taskflow/backend/models"
	"github.com/snehaamishraa/taskflow/backend/repositories"
	"github.com/snehaamishraa/taskflow/backend/utils"
)

const userInfoURL = "https://www.googleapis.com/oauth2/v2/userinfo"

// GoogleUser is the subset of Google's userinfo response we rely on.
type GoogleUser struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	Name          string `json:"name"`
	VerifiedEmail bool   `json:"verified_email"`
}

// GoogleOAuthConfig builds the OAuth config from the environment.
//
// Credentials are read on every call rather than cached at init so a missing
// key surfaces as a clear error at request time instead of a nil panic during
// startup.
func GoogleOAuthConfig() (*oauth2.Config, error) {
	clientID := config.GetEnvOr("", "GOOGLE_CLIENT_ID", "CLIENT_ID")
	clientSecret := config.GetEnvOr("", "GOOGLE_CLIENT_SECRET", "CLIENT_SECRET")

	if clientID == "" || clientSecret == "" {
		return nil, errors.New("google sign-in is not configured")
	}

	return &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL: config.GetEnvOr(
			"http://localhost:8080/api/auth/google/callback",
			"GOOGLE_REDIRECT_URL",
		),
		// Only identity scopes: this app never reads mail, files, or contacts.
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: googleoauth.Endpoint,
	}, nil
}

// FetchGoogleUser exchanges an authorization code for the caller's profile.
func FetchGoogleUser(ctx context.Context, code string) (*GoogleUser, error) {
	conf, err := GoogleOAuthConfig()
	if err != nil {
		return nil, err
	}

	token, err := conf.Exchange(ctx, code)
	if err != nil {
		return nil, fmt.Errorf("could not exchange code: %w", err)
	}

	client := conf.Client(ctx, token)
	client.Timeout = 10 * time.Second

	resp, err := client.Get(userInfoURL)
	if err != nil {
		return nil, fmt.Errorf("could not reach Google: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("google returned status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var user GoogleUser
	if err := json.Unmarshal(body, &user); err != nil {
		return nil, fmt.Errorf("could not read Google profile: %w", err)
	}

	if user.Email == "" || user.ID == "" {
		return nil, errors.New("google profile is missing an email")
	}

	// Google can return an unverified address on some workspace setups.
	// Accepting it would defeat the point of using Google to prove ownership.
	if !user.VerifiedEmail {
		return nil, errors.New("this Google account's email is not verified")
	}

	return &user, nil
}

// LoginWithGoogle resolves a Google profile to a local account and issues a JWT.
//
// Three cases, in order:
//   - known Google ID       -> sign in
//   - same email, no Google -> link the accounts rather than erroring, so a
//     password user who later clicks "Continue with Google" keeps their tasks
//   - neither               -> create a verified, password-less account
func LoginWithGoogle(profile *GoogleUser) (string, error) {
	user, err := repositories.GetUserByGoogleID(profile.ID)
	if err == nil {
		return utils.GenerateToken(user.ID)
	}

	existing, err := repositories.GetUserByEmail(profile.Email)
	if err == nil {
		existing.GoogleID = &profile.ID
		// Signing in through Google proves the address, whatever the account
		// started as.
		existing.IsVerified = true

		if err := repositories.UpdateUser(existing); err != nil {
			return "", err
		}
		return utils.GenerateToken(existing.ID)
	}

	name := profile.Name
	if name == "" {
		name = profile.Email
	}

	newUser := models.User{
		Name:       name,
		Email:      profile.Email,
		GoogleID:   &profile.ID,
		IsVerified: true,
		// Password stays nil: there is no password to check for this account,
		// and a random one would only be a lie in the database.
		Password: nil,
	}

	if err := repositories.CreateUser(&newUser); err != nil {
		return "", err
	}

	return utils.GenerateToken(newUser.ID)
}
