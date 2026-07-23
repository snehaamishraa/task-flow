package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID uint `gorm:"primaryKey" json:"id"`

	Name string `gorm:"not null" json:"name"`

	Email string `gorm:"unique;not null" json:"email"`

	// Nullable: accounts created through Google never set a password.
	// A pointer, not "", so the DB distinguishes "no password" from "empty".
	Password *string `json:"-"`

	// Set only for Google accounts. Indexed because the OAuth callback looks
	// users up by it. A pointer so every password user can share NULL without
	// colliding on the unique index.
	GoogleID *string `gorm:"uniqueIndex" json:"-"`

	// Google has already proven the address, so those accounts start verified.
	// Password signups stay false until they enter the emailed code.
	IsVerified bool `gorm:"not null;default:false" json:"is_verified"`

	// The code is stored as a bcrypt hash, never in plain text: a leaked
	// database snapshot should not hand out working codes.
	OTPHash string `json:"-"`

	OTPExpiresAt *time.Time `json:"-"`

	// Wrong guesses against the current code, reset whenever a new one is sent.
	// Six digits is a million possibilities, brute-forceable in seconds without
	// a cap.
	OTPAttempts int `gorm:"not null;default:0" json:"-"`

	// Drives the resend cooldown.
	OTPSentAt *time.Time `json:"-"`

	Tasks []Task `json:"tasks,omitempty"`

	CreatedAt time.Time `json:"created_at"`

	UpdatedAt time.Time `json:"updated_at"`

	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
