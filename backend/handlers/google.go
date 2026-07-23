package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"log"
	"net/url"
	"time"

	"github.com/gofiber/fiber/v2"

	"github.com/snehaamishraa/taskflow/backend/config"
	"github.com/snehaamishraa/taskflow/backend/services"
)

// Cookie holding the CSRF state value while the user is away at Google.
const oauthStateCookie = "oauth_state"

func frontendURL() string {
	return config.GetEnvOr("http://localhost:3000", "FRONTEND_URL")
}

// redirectWithError sends the browser back to the frontend with a readable
// reason. Errors cannot be returned as JSON here: the caller is a full-page
// browser redirect from Google, not a fetch.
func redirectWithError(c *fiber.Ctx, reason string) error {
	target := frontendURL() + "/login?error=" + url.QueryEscape(reason)
	return c.Redirect(target, fiber.StatusTemporaryRedirect)
}

// GoogleLogin starts the OAuth flow.
func GoogleLogin(c *fiber.Ctx) error {

	conf, err := services.GoogleOAuthConfig()

	if err != nil {
		return redirectWithError(c, err.Error())
	}

	// Random state, echoed back by Google and compared in the callback. Without
	// it, an attacker could feed a victim their own authorization code and have
	// the victim sign in as them.
	raw := make([]byte, 32)
	if _, err := rand.Read(raw); err != nil {
		return redirectWithError(c, "could not start Google sign-in")
	}
	state := base64.RawURLEncoding.EncodeToString(raw)

	c.Cookie(&fiber.Cookie{
		Name:     oauthStateCookie,
		Value:    state,
		Expires:  time.Now().Add(10 * time.Minute),
		HTTPOnly: true,
		// Lax, not Strict: the callback arrives as a cross-site top-level
		// navigation from Google, and Strict would withhold the cookie.
		SameSite: "Lax",
		Path:     "/",
	})

	return c.Redirect(conf.AuthCodeURL(state), fiber.StatusTemporaryRedirect)
}

// GoogleCallback completes the flow and hands a JWT back to the frontend.
func GoogleCallback(c *fiber.Ctx) error {

	// The user pressed Cancel on Google's consent screen.
	if errParam := c.Query("error"); errParam != "" {
		return redirectWithError(c, "Google sign-in was cancelled")
	}

	state := c.Query("state")
	expected := c.Cookies(oauthStateCookie)

	// Clear the cookie either way so a state value is never reusable.
	c.Cookie(&fiber.Cookie{
		Name:     oauthStateCookie,
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
		SameSite: "Lax",
		Path:     "/",
	})

	if state == "" || expected == "" || state != expected {
		return redirectWithError(c, "Sign-in session expired, please try again")
	}

	code := c.Query("code")
	if code == "" {
		return redirectWithError(c, "Google did not return an authorization code")
	}

	profile, err := services.FetchGoogleUser(c.Context(), code)
	if err != nil {
		// The underlying error is developer-facing ("oauth2: invalid_grant …")
		// and would be meaningless in a login banner, so it is logged and the
		// user gets something they can act on.
		log.Printf("google callback: %v", err)
		return redirectWithError(c, "Could not sign in with Google, please try again")
	}

	token, err := services.LoginWithGoogle(profile)
	if err != nil {
		log.Printf("google login for %s: %v", profile.Email, err)
		return redirectWithError(c, "Could not complete sign-in")
	}

	// The token travels in the URL because this app keeps its JWT in
	// localStorage, which a redirect cannot write to. The frontend callback
	// page stores it and immediately replaces the history entry so the token
	// does not linger in the address bar or back-button history.
	target := frontendURL() + "/auth/callback?token=" + url.QueryEscape(token)
	return c.Redirect(target, fiber.StatusTemporaryRedirect)
}
