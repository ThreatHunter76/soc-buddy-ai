import json
import requests
import re


OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
OLLAMA_MODEL = "llama3.2:3b"

MAX_CHUNK_CHARACTERS = 5000



def split_log(log_text):

    chunks = []
    current = ""

    for line in log_text.splitlines():

        if len(current) + len(line) > MAX_CHUNK_CHARACTERS:

            if current.strip():
                chunks.append(current)

            current = ""

        current += line + "\n"


    if current.strip():
        chunks.append(current)


    return chunks




def clean_list(items):

    if not isinstance(items, list):
        return []

    cleaned = []

    for item in items:

        if isinstance(item, str):

            item = item.strip()

            if item:
                cleaned.append(item)


    return list(dict.fromkeys(cleaned))




def remove_private_ip(items):

    result = []

    for item in items:

        if re.search(
            r"\b(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)",
            item
        ):
            continue


        result.append(item)


    return result




def analyze_chunk(log_chunk):


    prompt = f"""

You are SOC Buddy AI, a Tier 1 SOC Analyst.

Analyze this security log.

Return ONLY JSON.

Do not use markdown.

Do not explain.

Do not create fake evidence.


Rules:

1. Failed login attempts are suspicious but not proof of compromise.

2. Private IP addresses like:
192.168.x.x
10.x.x.x
172.16-31.x.x

are internal addresses and NOT IOC.

3. PowerShell is only suspicious if the command shows malicious behaviour.

4. Only add MITRE ATT&CK if the evidence clearly matches.

5. Always provide recommended actions.

6. Always provide analyst notes.

7. Confidence must be between 1 and 100.



Return exactly:


{{
"executive_summary":"",
"threat_summary":"",
"risk_level":"LOW",
"confidence":50,
"mitre_attack":[],
"iocs":[],
"evidence":[],
"recommended_actions":[],
"analyst_notes":""
}}



LOG:

{log_chunk}

"""


    response = requests.post(

        OLLAMA_URL,

        json={

            "model": OLLAMA_MODEL,

            "prompt": prompt,

            "stream": False,

            "format": "json"

        },

        timeout=600

    )


    response.raise_for_status()


    data = response.json()


    output = data.get(
        "response",
        "{}"
    )


    try:

        return json.loads(output)


    except:

        return {}





def analyze_log(log_text):


    chunks = split_log(log_text)



    final = {

        "executive_summary":
        f"SOC Buddy AI analyzed {len(chunks)} log section(s).",


        "threat_summary":"",


        "risk_level":"LOW",


        "confidence":50,


        "mitre_attack":[],


        "iocs":[],


        "evidence":[],


        "recommended_actions":
        [],


        "analyst_notes":
        "Analysis completed by SOC Buddy AI.",


        "chunks":len(chunks)

    }



    confidence_values = []



    for chunk in chunks:


        result = analyze_chunk(chunk)



        if result.get("executive_summary"):

            final["executive_summary"] = result["executive_summary"]



        if result.get("threat_summary"):

            final["threat_summary"] += (
                result["threat_summary"] + " "
            )



        if result.get("risk_level"):

            final["risk_level"] = result["risk_level"]



        if result.get("confidence"):

            confidence_values.append(
                result["confidence"]
            )



        final["mitre_attack"].extend(
            result.get("mitre_attack", [])
        )


        final["iocs"].extend(
            result.get("iocs", [])
        )


        final["evidence"].extend(
            result.get("evidence", [])
        )


        final["recommended_actions"].extend(
            result.get("recommended_actions", [])
        )



        if result.get("analyst_notes"):

            final["analyst_notes"] = (
                result["analyst_notes"]
            )





    final["mitre_attack"] = clean_list(
        final["mitre_attack"]
    )


    final["iocs"] = remove_private_ip(
        clean_list(final["iocs"])
    )


    final["evidence"] = clean_list(
        final["evidence"]
    )


    final["recommended_actions"] = clean_list(
        final["recommended_actions"]
    )



    if confidence_values:

        final["confidence"] = round(
            sum(confidence_values) /
            len(confidence_values)
        )



    # Safety fallback

    if not final["recommended_actions"]:

        final["recommended_actions"] = [

            "Review authentication logs for repeated failed access attempts.",

            "Validate PowerShell activity and confirm whether the execution was authorized.",

            "Continue monitoring the affected endpoint for unusual behaviour."

        ]



    if not final["threat_summary"]:

        final["threat_summary"] = (

            "No confirmed compromise detected. "
            "Suspicious activity requires analyst review."

        )



    return final