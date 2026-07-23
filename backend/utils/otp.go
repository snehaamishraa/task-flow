package utils

import (
	"crypto/rand"
	"fmt"
	"math/big"

	"golang.org/x/crypto/bcrypt"
)

const (
	// OTPLength is the number of digits in a generated code.
	OTPLength = 6

	// MaxOTPAttempts caps wrong guesses per issued code.
	MaxOTPAttempts = 5
)

// GenerateOTP returns a zero-padded numeric code of OTPLength digits.
//
// Uses crypto/rand, not math/rand: a predictable code would let anyone verify
// somebody else's address.
func GenerateOTP() (string, error) {
	limit := big.NewInt(1)
	for i := 0; i < OTPLength; i++ {
		limit.Mul(limit, big.NewInt(10))
	}

	n, err := rand.Int(rand.Reader, limit)
	if err != nil {
		return "", err
	}

	// Zero-padded so "42" stays a six-digit "000042".
	return fmt.Sprintf("%0*d", OTPLength, n), nil
}

// HashOTP hashes a code for storage.
//
// bcrypt at MinCost rather than DefaultCost: codes live for ten minutes and are
// checked on a user-facing request, so the work factor that protects a
// long-lived password only adds latency here.
func HashOTP(code string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(code), bcrypt.MinCost)
	return string(hash), err
}

// CheckOTP reports whether a submitted code matches the stored hash.
func CheckOTP(code string, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(code))
}
