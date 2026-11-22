def detect_events(parsed_log):

    print("DEBUG PARSED LOG:")
    print(parsed_log)

    detections = []

    event_ids = parsed_log.get("event_ids", [])

    processes = [
        p.lower()
        for p in parsed_log.get("processes", [])
        if p
    ]

    commands = [
        c.lower()
        for c in parsed_log.get("commands", [])
        if c
    ]

    ips = parsed_log.get("ips", [])

    raw_log = parsed_log.get(
        "raw_log",
        ""
    ).lower()


    # ==========================
    # Wazuh Native Detection
    # ==========================

    wazuh_rule = parsed_log.get(
        "wazuh_rule",
        {}
    )

    if wazuh_rule:

        rule_description = wazuh_rule.get(
            "description",
            ""
        )

        rule_level = wazuh_rule.get(
            "level",
            0
        )

        rule_id = wazuh_rule.get(
            "id"
        )

        detections.append({

            "name": rule_description,

            "category": "Wazuh Alert",

            "description":
                f"Wazuh detected: {rule_description}",

            "severity":
                "HIGH" if rule_level >= 10
                else "MEDIUM" if rule_level >= 5
                else "LOW",

            "wazuh_rule_id": rule_id,

            "wazuh_level": rule_level

        })


    # ==========================
    # Authentication Detection
    # ==========================

    if "4625" in event_ids:

        detections.append({

            "name": "Failed Login Attempt",

            "category": "Authentication",

            "description":
                "A failed authentication attempt was detected.",

            "severity": "LOW"

        })


    if "4624" in event_ids:

        detections.append({

            "name": "Successful Login",

            "category": "Authentication",

            "description":
                "A successful user authentication was detected.",

            "severity": "INFO"

        })


    if "4688" in event_ids:

        trusted_processes = [

            "splunkd.exe",
            "splunk-optimize.exe",
            "svchost.exe",
            "explorer.exe",
            "services.exe"

        ]

        suspicious_processes = [

            "powershell.exe",
            "cmd.exe",
            "mimikatz.exe",
            "certutil.exe",
            "rundll32.exe",
            "psexec.exe"

        ]


        process_text = " ".join(
            process.split("\\")[-1]
            for process in processes
        ).lower()


        if any(
            process in process_text
            for process in suspicious_processes
        ):

            detections.append({

                "name": "Suspicious Process Creation",

                "category": "Execution",

                "description":
                "A potentially suspicious process was created.",

                "severity": "MEDIUM"

            })


        elif any(
            process in process_text
            for process in trusted_processes
        ):

            detections.append({

                "name": "Known Legitimate Process Creation",

                "category": "Execution",

                "description":
                "A trusted system or application process was created.",

                "severity": "INFO"

            })


        else:

            detections.append({

                "name": "Process Creation",

                "category": "Execution",

                "description":
                "Windows Event ID 4688 indicates a new process was created.",

                "severity": "LOW"

            })
    if "multiple failed logins" in raw_log:

        detections.append({

            "name":
                "Multiple Failed Login Attempts",

            "category":
                "Authentication",

            "description":
                "Multiple failed authentication attempts were detected.",

            "severity":
                "MEDIUM"

        })


    # ==========================
    # PowerShell Detection
    # ==========================

    if any(
    process.endswith("powershell.exe")
    for process in processes
):

        detections.append({

            "name": "PowerShell Execution",

            "category": "Execution",

            "description":
                "PowerShell execution was detected.",

            "severity": "MEDIUM"

        })


    for command in commands:

        if "-enc" in command:

            detections.append({

                "name":
                    "Encoded PowerShell Command",

                "category":
                    "Defense Evasion",

                "description":
                    "Encoded PowerShell command detected.",

                "severity":
                    "HIGH"

            })


    # ==========================
    # Command Execution
    # ==========================

    suspicious_processes = [

        "cmd.exe",
        "wmic.exe",
        "rundll32.exe",
        "psexec.exe"

    ]


    for process in suspicious_processes:

        if process in processes:

            detections.append({

                "name":
                    f"{process} Execution",

                "category":
                    "Execution",

                "description":
                    f"{process} execution detected.",

                "severity":
                    "MEDIUM"

            })


    # ==========================
    # Firewall / Network Detection
    # ==========================

    action = (
        parsed_log.get("action")
        or ""
    ).lower()


    destination_port = parsed_log.get(
        "destination_port"
    )


    protocol = (
        parsed_log.get("protocol")
        or ""
    ).lower()


    bytes_sent = parsed_log.get(
        "bytes"
    )


    if action in [
        "deny",
        "blocked",
        "drop"
    ]:

        detections.append({

            "name":
                "Firewall Blocked Connection",

            "category":
                "Network Security",

            "description":
                "Firewall blocked a network connection.",

            "severity":
                "MEDIUM"

        })


    external_ports = [

        "4444",
        "8080",
        "8443",

    ]


    if destination_port in external_ports:

        detections.append({

            "name":
                "Suspicious Network Communication",

            "category":
                "Command and Control",

            "description":
                f"Outbound communication detected on port {destination_port}.",

            "severity":
                "MEDIUM"

        })


    try:

        if bytes_sent and int(bytes_sent) > 1000000:

            detections.append({

                "name":
                    "Large Outbound Data Transfer",

                "category":
                    "Exfiltration",

                "description":
                    "Large volume of outbound network traffic detected.",

                "severity":
                    "HIGH"

            })

    except:

        pass


    if any(keyword in raw_log for keyword in [

        "port scan",
        "nmap",
        "scan detected",
        "multiple ports"

    ]):

        detections.append({

            "name":
                "Network Scanning Activity",

            "category":
                "Discovery",

            "description":
                "Possible network scanning activity detected.",

            "severity":
                "MEDIUM"

        })


    dos_keywords = [

        "flood",
        "dos",
        "ddos",
        "traffic spike",
        "packet flood"

    ]


    for keyword in dos_keywords:

        if keyword in raw_log:

            detections.append({

                "name":
                    "Possible Denial of Service Activity",

                "category":
                    "Impact",

                "description":
                    "Possible network disruption activity detected.",

                "severity":
                    "HIGH"

            })

            break


    outbound_keywords = [

        "outbound connection",
        "external connection",
        "beacon",
        "command and control"

    ]


    for keyword in outbound_keywords:

        if keyword in raw_log:

            detections.append({

                "name":
                    "Suspicious Outbound Communication",

                "category":
                    "Command and Control",

                "description":
                    "Suspicious outbound network communication detected.",

                "severity":
                    "HIGH"

            })

            break


    # ==========================
    # Network Activity Observation
    # ==========================

    if parsed_log.get("source_ip") and parsed_log.get("destination_ip"):

        detections.append({

            "name":
                "Network Connection Observed",

            "category":
                "Network Activity",

            "description":
                f"Connection from {parsed_log.get('source_ip')} to {parsed_log.get('destination_ip')} over {protocol.upper()}.",

            "severity":
                "INFO",

            "source_ip":
                parsed_log.get("source_ip"),

            "destination_ip":
                parsed_log.get("destination_ip"),

            "destination_port":
                parsed_log.get("destination_port"),

            "protocol":
                protocol,

            "bytes":
                parsed_log.get("bytes")

        })


    return detections