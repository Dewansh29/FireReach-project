"""
email_sender.py
---------------
SMTP-based email delivery using environment variables.
Replaces the previous Google OAuth / Gmail API approach.

Required environment variables:
    SMTP_HOST  - SMTP server hostname   (e.g. smtp.gmail.com)
    SMTP_PORT  - SMTP server port       (e.g. 587 for TLS, 465 for SSL)
    SMTP_USER  - Sender email address   (e.g. yourapp@gmail.com)
    SMTP_PASS  - App password / secret  (never hard-code this)
"""

import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# ── Logger ────────────────────────────────────────────────────────────────────
logger = logging.getLogger("firereach.email")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

# ── SMTP credentials from environment ─────────────────────────────────────────
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")


def _create_transporter() -> smtplib.SMTP:
    """
    Create and return a reusable authenticated SMTP connection.
    Uses STARTTLS (port 587) by default; falls back to direct SSL (port 465).
    """
    if SMTP_PORT == 465:
        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT)
    else:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.ehlo()
        server.starttls()
        server.ehlo()

    server.login(SMTP_USER, SMTP_PASS)
    logger.info("SMTP transporter created and authenticated for %s", SMTP_USER)
    return server


def send_email(
    to: str,
    subject: str,
    body: str,
    html: bool = False,
) -> str:
    """
    Send an email via SMTP.

    Args:
        to      : Recipient email address.
        subject : Email subject line.
        body    : Plain-text (or HTML) message body.
        html    : Set True to send body as HTML; defaults to plain text.

    Returns:
        A status string indicating success or describing the failure.
    """
    if not SMTP_USER or not SMTP_PASS:
        msg = "Email delivery skipped: SMTP_USER / SMTP_PASS not configured."
        logger.error(msg)
        return f"Error: {msg}"

    if not to:
        msg = "Email delivery skipped: recipient address is empty."
        logger.warning(msg)
        return f"Error: {msg}"

    try:
        # Build MIME message
        mime_msg = MIMEMultipart("alternative")
        mime_msg["From"] = SMTP_USER
        mime_msg["To"] = to
        mime_msg["Subject"] = subject

        content_type = "html" if html else "plain"
        mime_msg.attach(MIMEText(body, content_type))

        # Open transport, send, close
        with _create_transporter() as server:
            server.sendmail(SMTP_USER, to, mime_msg.as_string())

        logger.info("Email sent successfully to %s | Subject: %s", to, subject)
        return f"Success — Email delivered to {to}."

    except smtplib.SMTPAuthenticationError as e:
        logger.error("SMTP auth failed: %s", e)
        return f"Error: SMTP authentication failed. Check SMTP_USER / SMTP_PASS. Detail: {e}"

    except smtplib.SMTPConnectError as e:
        logger.error("SMTP connection error: %s", e)
        return f"Error: Could not connect to SMTP server {SMTP_HOST}:{SMTP_PORT}. Detail: {e}"

    except smtplib.SMTPRecipientsRefused as e:
        logger.error("Recipient refused: %s", e)
        return f"Error: Recipient address refused by server: {to}. Detail: {e}"

    except Exception as e:
        logger.exception("Unexpected error while sending email to %s", to)
        return f"Error: Failed to send email. Detail: {e}"
