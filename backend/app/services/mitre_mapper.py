MITRE_RULES = {

    "Failed Login Attempt": {

        "technique": "T1110",

        "name": "Brute Force",

        "tactic": "Credential Access"

    },


    "Successful Login": {

        "technique": "T1078",

        "name": "Valid Accounts",

        "tactic": "Defense Evasion"

    },


    "PowerShell Execution": {

        "technique": "T1059.001",

        "name": "PowerShell",

        "tactic": "Execution"

    },


    "Encoded PowerShell Command": {

        "technique": "T1027",

        "name": "Obfuscated Files or Information",

        "tactic": "Defense Evasion"

    },


    "cmd.exe Execution": {

        "technique": "T1059.003",

        "name": "Windows Command Shell",

        "tactic": "Execution"

    },


    "wmic.exe Execution": {

        "technique": "T1047",

        "name": "Windows Management Instrumentation",

        "tactic": "Execution"

    },


    "rundll32.exe Execution": {

        "technique": "T1218.011",

        "name": "Rundll32",

        "tactic": "Defense Evasion"

    },


    "psexec.exe Execution": {

        "technique": "T1569.002",

        "name": "Service Execution",

        "tactic": "Privilege Escalation"

    },


    "Network Scanning Activity": {

        "technique": "T1046",

        "name": "Network Service Scanning",

        "tactic": "Discovery"

    },


    "Possible Denial of Service Activity": {

        "technique": "T1498",

        "name": "Network Denial of Service",

        "tactic": "Impact"

    },


    "Suspicious Outbound Communication": {

        "technique": "T1071",

        "name": "Application Layer Protocol",

        "tactic": "Command and Control"

    }

}



def map_mitre(detections):

    results = []


    for detection in detections:

        name = detection.get(
            "name"
        )


        if name in MITRE_RULES:

            results.append(
                MITRE_RULES[name]
            )


    return results