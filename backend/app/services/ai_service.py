import os
from openai import OpenAI


class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = None

        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)

    def analyze_incident(self, title, description, severity="Medium"):
        prompt = f"""
You are a Senior SOC Analyst.

Analyze the following security incident.

Incident:
Title: {title}
Description: {description}
Severity: {severity}

Provide:

1. Threat Summary
2. MITRE ATT&CK Technique
3. Risk Level
4. Recommended Actions
5. SOC Analyst Notes
"""

        if self.client:
            try:
                response = self.client.chat.completions.create(
                    model="gpt-4.1-mini",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a Senior SOC Analyst."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.3
                )

                return {
                    "analysis": response.choices[0].message.content,
                    "source": "OpenAI"
                }

            except Exception as e:
                print(f"OpenAI Error: {e}")

        severity_text = str(severity).upper()

        if severity_text in ["CRITICAL", "HIGH"]:
            risk_level = "HIGH"
        elif severity_text == "MEDIUM":
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        fallback_analysis = f"""
## Threat Summary

The incident '{title}' indicates suspicious security activity
that requires investigation by the SOC team.

## Incident Description

{description}

The available information may indicate an attempted account
compromise or unauthorized access.

## MITRE ATT&CK

Technique: T1110 - Brute Force

Tactic: Credential Access

## Risk Level

{risk_level}

Reported severity:

{severity}

## Recommended Actions

1. Review authentication and security logs.

2. Identify the source IP address and determine whether the
   activity is legitimate.

3. Check for repeated failed authentication attempts.

4. Investigate successful logins following multiple failures.

5. Enable or verify Multi-Factor Authentication (MFA).

6. Reset affected credentials if unauthorized access is suspected.

7. Investigate or block malicious source IP addresses where
   appropriate.

8. Create or tune a SIEM detection rule for repeated failed
   authentication attempts.

9. Continue monitoring the affected account and endpoint.

## SOC Analyst Notes

SOC Buddy used its built-in fallback analysis engine because
the OpenAI API was unavailable or the API quota was exhausted.
"""

        return {
            "analysis": fallback_analysis,
            "source": "SOC Buddy Fallback Engine"
        }


ai_service = AIService()


def analyze_incident(title, description, severity="Medium"):
    return ai_service.analyze_incident(
        title=title,
        description=description,
        severity=severity
    )
