import os
import requests
from dotenv import load_dotenv

load_dotenv()

HUNTER_API_KEY = os.getenv("HUNTER_API_KEY")


def search_emails_by_domain(domain: str, limit: int = 5) -> list:
    """
    Uses the Hunter.io Domain Search API to find email addresses
    associated with a given company domain.
    Returns a list of dicts with email, name, position info.
    """
    if not HUNTER_API_KEY:
        return [{"error": "No Hunter.io API key found in .env"}]

    url = "https://api.hunter.io/v2/domain-search"
    params = {
        "domain": domain,
        "api_key": HUNTER_API_KEY,
        "limit": limit,
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        emails = []
        for entry in data.get("data", {}).get("emails", []):
            emails.append({
                "email": entry.get("value", ""),
                "first_name": entry.get("first_name", ""),
                "last_name": entry.get("last_name", ""),
                "position": entry.get("position", ""),
                "department": entry.get("department", ""),
                "confidence": entry.get("confidence", 0),
            })

        return emails
    except Exception as e:
        return [{"error": f"Hunter.io API error: {str(e)}"}]


def find_email_by_name(domain: str, first_name: str, last_name: str) -> dict:
    """
    Uses the Hunter.io Email Finder API to find a specific person's
    email at a given domain.
    """
    if not HUNTER_API_KEY:
        return {"error": "No Hunter.io API key found in .env"}

    url = "https://api.hunter.io/v2/email-finder"
    params = {
        "domain": domain,
        "first_name": first_name,
        "last_name": last_name,
        "api_key": HUNTER_API_KEY,
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return {
            "email": data.get("data", {}).get("email", ""),
            "confidence": data.get("data", {}).get("confidence", 0),
        }
    except Exception as e:
        return {"error": f"Hunter.io Email Finder error: {str(e)}"}


def verify_email(email: str) -> dict:
    """
    Uses the Hunter.io Email Verifier to check if an email is valid.
    """
    if not HUNTER_API_KEY:
        return {"error": "No Hunter.io API key found in .env"}

    url = "https://api.hunter.io/v2/email-verifier"
    params = {
        "email": email,
        "api_key": HUNTER_API_KEY,
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return {
            "status": data.get("data", {}).get("status", "unknown"),
            "result": data.get("data", {}).get("result", "unknown"),
        }
    except Exception as e:
        return {"error": f"Hunter.io Verifier error: {str(e)}"}
