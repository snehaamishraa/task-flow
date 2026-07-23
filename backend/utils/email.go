package utils

import (
	"net/mail"
	"strings"
)

// NormalizeEmail trims surrounding space and lowercases the address.
//
// Stored normalized so "Sneha@Gmail.com" and "sneha@gmail.com" cannot become
// two separate accounts.
func NormalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

// IsValidEmail reports whether an address is well-formed enough to accept.
//
// This proves shape, not existence: fake@fake.fake passes here and is still not
// a real inbox. Only sending a code to it proves ownership.
func IsValidEmail(email string) bool {
	email = NormalizeEmail(email)

	if email == "" {
		return false
	}

	// net/mail accepts display-name forms like `Sneha <a@b.com>`, which are
	// valid headers but not valid account identifiers.
	if strings.ContainsAny(email, " <>,;\"\\") {
		return false
	}

	addr, err := mail.ParseAddress(email)
	if err != nil || addr.Address != email {
		return false
	}

	at := strings.LastIndex(email, "@")
	if at <= 0 {
		return false
	}

	local, domain := email[:at], email[at+1:]
	if local == "" || domain == "" {
		return false
	}

	// net/mail accepts "a@b". A public address needs a dot-separated TLD, and
	// the label either side of every dot must be non-empty.
	labels := strings.Split(domain, ".")
	if len(labels) < 2 {
		return false
	}
	for _, label := range labels {
		if label == "" {
			return false
		}
	}

	// Shortest real TLDs are two characters.
	return len(labels[len(labels)-1]) >= 2
}
