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

	// Set for accounts created through Google, which has already proven the
	// address. Nothing gates on it today; it is kept so email verification can
	// be reintroduced without another migration.
	IsVerified bool `gorm:"not null;default:false" json:"is_verified"`

	Tasks []Task `json:"tasks,omitempty"`

	CreatedAt time.Time `json:"created_at"`

	UpdatedAt time.Time `json:"updated_at"`

	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
