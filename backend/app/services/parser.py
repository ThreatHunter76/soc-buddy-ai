import re
import json


def extract_ips(text):
    """
    Extract IPv4 addresses
    """

    return list(set(
        re.findall(
            r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
            text
        )
    ))


def detect_log_type(log_text):

    text = log_text.lower()

    # Wazuh
    if (
        "wazuh" in text
        or '"rule"' in text
        or "manager" in text
    ):
        return "wazuh"


    # Windows Event
    if (
        "eventid" in text
        or "event id" in text
        or "4625" in text
        or "4624" in text
    ):
        return "windows_event"


    # Firewall / Network logs
    if any(word in text for word in [
        "firewall",
        "src=",
        "dst=",
        "dport=",
        "sport=",
        "allow",
        "deny",
        "blocked",
        "connection"
    ]):
        return "firewall"


    # JSON
    if (
        text.strip().startswith("{")
        or text.strip().startswith("[")
    ):
        return "json"


    return "unknown"



def extract_key_value(log_text, key):

    pattern = rf"{key}=([^\s]+)"

    match = re.search(
        pattern,
        log_text,
        re.I
    )

    if match:
        return match.group(1)

    return None



def parse_json_log(log_text):

    result = {
        "raw_log": log_text
    }


    try:

        data = json.loads(log_text)

        flat = json.dumps(data)


        result.update({

            "ips": extract_ips(flat),

            "event_ids": re.findall(
                r"(?:event.?id|id)[\":=\s]+(\d+)",
                flat,
                re.I
            ),

            "source_ip": (
                data.get("srcip")
                or data.get("source_ip")
                or data.get("src")
            ),

            "destination_ip": (
                data.get("dstip")
                or data.get("destination_ip")
                or data.get("dst")
            ),

            "severity": (
                data.get("level")
                or data.get("severity")
            )

        })


        return result


    except Exception:

        return {
            "raw_log": log_text,
            "ips": extract_ips(log_text)
        }



def parse_firewall_log(log_text):

    return {

        "source_ip": extract_key_value(
            log_text,
            "src"
        ),

        "destination_ip": extract_key_value(
            log_text,
            "dst"
        ),

        "source_port": extract_key_value(
            log_text,
            "sport"
        ),

        "destination_port": extract_key_value(
            log_text,
            "dport"
        ),

        "protocol": extract_key_value(
            log_text,
            "proto"
        ),

        "action": extract_key_value(
            log_text,
            "action"
        ),

        "bytes": extract_key_value(
            log_text,
            "bytes"
        )

    }

def parse_wazuh_alert(alert):

    rule = alert.get("rule", {})
    agent = alert.get("agent", {})
    data = alert.get("data", {})

    eventdata = (
        data
        .get("win", {})
        .get("eventdata", {})
    )

    system = (
        data
        .get("win", {})
        .get("system", {})
    )


    processes = []

    commands = []

    users = []


    # Extract process names

    new_process = eventdata.get(
        "newProcessName"
    )

    parent_process = eventdata.get(
        "parentProcessName"
    )


    if new_process:
        processes.append(
            new_process
        )


    if parent_process:
        processes.append(
            parent_process
        )


    # Extract command line

    command_line = eventdata.get(
        "commandLine"
    )


    if command_line:
        commands.append(
            command_line
        )


    # Extract username

    username = eventdata.get(
        "subjectUserName"
    )


    if username:
        users.append(
            username
        )


    return {

        "log_type": "wazuh",

        "event_ids": [
            system.get("eventID")
        ] if system.get("eventID") else [],


        "ips": [
            agent.get("ip")
        ] if agent.get("ip") else [],


        "source_ip": None,

        "destination_ip": None,

        "source_port": None,

        "destination_port": None,

        "protocol": None,

        "action": None,


        "severity": rule.get("level"),


        "users": users,


        "processes": processes,


        "commands": commands,


        "wazuh_rule": rule,


        "wazuh_agent": agent,


        "raw_log": str(alert)

    }

def parse_log(log_text):


    log_type = detect_log_type(
        log_text
    )


    result = {

        "log_type": log_type,

        "event_ids": [],

        "ips": [],

        "source_ip": None,

        "destination_ip": None,

        "source_port": None,

        "destination_port": None,

        "protocol": None,

        "action": None,

        "severity": None,

        "users": [],

        "processes": [],

        "commands": [],

        "raw_log": log_text

    }



    #
    # JSON Logs
    #

    if log_type in [
        "json",
        "wazuh"
    ]:

        json_result = parse_json_log(
            log_text
        )

        result.update(
            json_result
        )

        return result



    #
    # Firewall Logs
    #

    if log_type == "firewall":

        firewall_data = parse_firewall_log(
            log_text
        )

        result.update(
            firewall_data
        )



    #
    # Generic IP extraction
    #

    result["ips"] = extract_ips(
        log_text
    )



    #
    # Windows Event IDs
    #

    result["event_ids"] = re.findall(

        r"(?:EventID|Event ID)[=: ]+(\d+)",

        log_text,

        re.I

    )


    lower = log_text.lower()



    #
    # User extraction
    #

    result["users"] = re.findall(

        r"(?:User|Username|Account Name)[=: ]+([A-Za-z0-9._\\-]+)",

        log_text,

        re.I

    )



    #
    # Process extraction
    #

    result["processes"] = re.findall(

        r"(powershell|cmd\.exe|powershell\.exe|wmic|rundll32|psexec)",

        log_text,

        re.I

    )



    #
    # Commands
    #

    result["commands"] = re.findall(

        r"(?:CommandLine|Command|cmd)[=: ]+(.+)",

        log_text,

        re.I

    )



    #
    # Security event enrichment
    #

    if any(word in lower for word in [
        "failed login",
        "failed logon",
        "authentication failure"
    ]):

        result["event_ids"].append(
            "4625"
        )


    if "successful login" in lower:

        result["event_ids"].append(
            "4624"
        )


    if "powershell" in lower:

        result["processes"].append(
            "powershell"
        )


    return result