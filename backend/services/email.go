package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime"
	"net/http"
	"net/smtp"
	"strings"
	"time"

	"github.com/snehaamishraa/taskflow/backend/config"
)

const resendEndpoint = "https://api.resend.com/emails"

var emailClient = &http.Client{Timeout: 15 * time.Second}

// SendOTPEmail delivers a verification code through whichever provider is
// configured.
//
// SMTP is preferred when present: an API provider on its shared sending domain
// (Resend's onboarding@resend.dev) can only deliver to the account owner, while
// SMTP authenticated as a real mailbox reaches anybody. Resend stays as the
// fallback so switching is a matter of which variables are set.
//
// Returns an error rather than logging and continuing: if the mail does not go
// out, signup must not report success, or the user waits for a code that will
// never arrive.
func SendOTPEmail(to string, name string, code string) error {
	greeting := name
	if greeting == "" {
		greeting = "there"
	}

	subject := code + " is your TaskFlow verification code"
	html := otpEmailHTML(greeting, code)
	text := fmt.Sprintf(
		"Hi %s,\n\nYour TaskFlow verification code is %s.\nIt expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.",
		greeting, code,
	)

	if config.GetEnv("SMTP_HOST") != "" {
		return sendViaSMTP(to, subject, html, text)
	}

	if config.GetEnv("RESEND_API_KEY") != "" {
		return sendViaResend(to, subject, html, text)
	}

	return errors.New("email sending is not configured")
}

/* ------------------------------------------------------------------ *
 * SMTP (Gmail app password, or any host)
 * ------------------------------------------------------------------ */

func sendViaSMTP(to string, subject string, html string, text string) error {
	host := config.GetEnv("SMTP_HOST")
	port := config.GetEnvOr("587", "SMTP_PORT")
	user := config.GetEnv("SMTP_USER")
	// Google displays app passwords grouped as "abcd efgh ijkl mnop" for
	// readability, and the spaces are almost always copied along with them.
	// They are never part of the credential, so strip all whitespace.
	password := strings.Join(strings.Fields(config.GetEnv("SMTP_PASSWORD")), "")

	if user == "" || password == "" {
		return errors.New("SMTP_USER and SMTP_PASSWORD are required")
	}

	// Gmail rewrites the From header to the authenticated mailbox anyway, so
	// defaulting to the login address avoids a mismatch that some servers
	// reject outright.
	from := config.GetEnvOr(fmt.Sprintf("TaskFlow <%s>", user), "MAIL_FROM")

	msg := buildMIMEMessage(from, to, subject, html, text)

	// net/smtp upgrades to STARTTLS automatically when the server advertises
	// it, which Gmail does on 587.
	auth := smtp.PlainAuth("", user, password, host)

	return smtp.SendMail(host+":"+port, auth, extractAddress(from), []string{to}, msg)
}

// buildMIMEMessage assembles a multipart/alternative message.
//
// Both parts are included so clients that block HTML still show the code, and
// because an HTML-only message scores worse with spam filters.
func buildMIMEMessage(from, to, subject, html, text string) []byte {
	boundary := "taskflow-boundary-7f3a9c2e"

	var b bytes.Buffer
	// CRLF endings throughout: SMTP requires them, and a bare \n can truncate
	// the message at the first header on strict servers.
	b.WriteString("From: " + from + "\r\n")
	b.WriteString("To: " + to + "\r\n")
	// Encoded so a non-ASCII subject is not mangled.
	b.WriteString("Subject: " + mime.QEncoding.Encode("utf-8", subject) + "\r\n")
	b.WriteString("MIME-Version: 1.0\r\n")
	b.WriteString("Content-Type: multipart/alternative; boundary=\"" + boundary + "\"\r\n")
	b.WriteString("\r\n")

	b.WriteString("--" + boundary + "\r\n")
	b.WriteString("Content-Type: text/plain; charset=\"utf-8\"\r\n\r\n")
	b.WriteString(strings.ReplaceAll(text, "\n", "\r\n"))
	b.WriteString("\r\n")

	b.WriteString("--" + boundary + "\r\n")
	b.WriteString("Content-Type: text/html; charset=\"utf-8\"\r\n\r\n")
	b.WriteString(html)
	b.WriteString("\r\n")

	b.WriteString("--" + boundary + "--\r\n")

	return b.Bytes()
}

// extractAddress pulls the bare address out of `Name <a@b.com>`, which is what
// the SMTP envelope needs.
func extractAddress(from string) string {
	if start := strings.LastIndex(from, "<"); start != -1 {
		if end := strings.LastIndex(from, ">"); end > start {
			return from[start+1 : end]
		}
	}
	return strings.TrimSpace(from)
}

/* ------------------------------------------------------------------ *
 * Resend HTTP API
 * ------------------------------------------------------------------ */

// Verified against the Resend docs: POST /emails with from, to, subject, and
// one content field, authorised by a bearer key. 200 returns {"id": "..."}.
type resendRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
	Text    string   `json:"text"`
}

func sendViaResend(to string, subject string, html string, text string) error {
	payload := resendRequest{
		// The shared sender works without verifying a domain, but only
		// delivers to the address that owns the Resend account.
		From:    config.GetEnvOr("TaskFlow <onboarding@resend.dev>", "MAIL_FROM"),
		To:      []string{to},
		Subject: subject,
		HTML:    html,
		Text:    text,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, resendEndpoint, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+config.GetEnv("RESEND_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	resp, err := emailClient.Do(req)
	if err != nil {
		return fmt.Errorf("could not reach the email service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		detail, _ := io.ReadAll(io.LimitReader(resp.Body, 512))
		return fmt.Errorf("email service returned %d: %s", resp.StatusCode, string(detail))
	}

	return nil
}

func otpEmailHTML(name string, code string) string {
	return fmt.Sprintf(`<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#111113;border:1px solid #26262b;border-radius:16px;padding:32px;">
      <h1 style="margin:0 0 8px;font-size:20px;color:#fafafa;">Verify your email</h1>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#a1a1aa;">
        Hi %s, enter this code in TaskFlow to finish setting up your account.
      </p>
      <div style="margin:0 0 24px;padding:20px;background:#18181b;border:1px solid #33333a;border-radius:12px;text-align:center;">
        <span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:32px;font-weight:600;letter-spacing:8px;color:#a78bfa;">%s</span>
      </div>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">
        This code expires in 10 minutes. If you didn't create a TaskFlow account, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>`, name, code)
}
