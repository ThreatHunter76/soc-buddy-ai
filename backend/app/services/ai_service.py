import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def analyze_incident(title: str, description: str):
    prompt = f"""
You are a Senior SOC Analyst.

Analyze this security incident.

Title:
{title}

Description:
{description}

Return:

Summary:
Severity:
MITRE ATT&CK Technique:
Recommended Actions:
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert SOC analyst."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"OpenAI Error: {e}")

        return f"""
Summary:
Possible brute-force attack detected.

Severity:
High

MITRE ATT&CK Technique:
T1110 - Brute Force

Recommended Actions:
- Block the suspicious IP address.
- Enable Multi-Factor Authentication (MFA).
- Reset affected user credentials.
- Review authentication and firewall logs.
- Continue monitoring for additional malicious activity.

Note:
Live AI analysis is currently unavailable because the OpenAI API could not be reached or the account has insufficient credits.
"""