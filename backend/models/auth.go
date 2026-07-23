package models

type SignupRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type VerifyOTPRequest struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

type ResendOTPRequest struct {
	Email string `json:"email"`
}

type AuthResponse struct {
	Message string `json:"message"`
	Token   string `json:"token,omitempty"`

	// True when the caller must enter an emailed code before a token is issued.
	// The frontend routes to /verify-otp on this flag rather than matching on
	// the message text.
	RequiresVerification bool `json:"requires_verification,omitempty"`

	// Echoed back so the verify screen knows which address to confirm without
	// threading it through client-side state.
	Email string `json:"email,omitempty"`
}
