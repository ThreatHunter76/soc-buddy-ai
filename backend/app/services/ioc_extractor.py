import re
import ipaddress


def is_private_ip(ip):

    try:
        return ipaddress.ip_address(ip).is_private

    except:
        return False



def is_suspicious_domain(domain):

    suspicious_keywords = [

        "exfil",
        "malware",
        "payload",
        "c2",
        "command",
        "control",
        "dropper",
        "botnet",
        "stealer",
        "phishing"

    ]


    domain = domain.lower()


    return any(
        keyword in domain
        for keyword in suspicious_keywords
    )



def extract_iocs(parsed_log):

    raw_log = parsed_log.get(
        "raw_log",
        ""
    )


    result = {

        "ips": [],

        "domains": [],

        "hashes": [],

        "internal_ips": [],

        "suspicious_domains": [],

        "external_ips": []

    }



    # ==========================
    # Extract IP Addresses
    # ==========================

    ips = re.findall(
        r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
        raw_log
    )


    for ip in set(ips):

        if is_private_ip(ip):

            result["internal_ips"].append(ip)

        else:

            result["ips"].append(ip)

            result["external_ips"].append(ip)



    # ==========================
    # Extract Domains
    # ==========================

    domains = re.findall(
        r"\b[a-zA-Z0-9.-]+\.(?:com|net|org|io|xyz|info)\b",
        raw_log
    )


    for domain in set(domains):

        result["domains"].append(domain)


        if is_suspicious_domain(domain):

            result["suspicious_domains"].append(domain)



    # ==========================
    # Extract Hashes
    # ==========================

    hashes = re.findall(
        r"\b[a-fA-F0-9]{32,64}\b",
        raw_log
    )


    result["hashes"] = list(set(hashes))


    return result