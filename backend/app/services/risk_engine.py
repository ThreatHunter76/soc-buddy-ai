def calculate_risk(detections, iocs, mitre_results):

    score = 0


    # Severity scoring

    severity_scores = {

        "INFO": 0,

        "LOW": 10,

        "MEDIUM": 25,

        "HIGH": 40,

        "CRITICAL": 60

    }


    seen = set()

    for detection in detections:

        name = detection.get("name")

        if name in seen:
            continue

        seen.add(name)

        severity = detection.get(
            "severity",
            "LOW"
        )

        score += severity_scores.get(
            severity,
            0
        )


    # IOC scoring

    # Only suspicious indicators should increase risk


    if iocs.get("domains"):

        score += 25


    if iocs.get("hashes"):

        score += 40



    # MITRE technique bonus

    if len(mitre_results) >= 3:

        score += 10



    # Limit score

    if score > 100:

        score = 100



    # Risk classification

    if score >= 80:

        risk = "CRITICAL"

    elif score >= 60:

        risk = "HIGH"

    elif score >= 30:

        risk = "MEDIUM"

    else:

        risk = "LOW"



    # Confidence

    confidence = min(
        50 + (len(detections) * 10),
        95
    )


    return {

        "risk_level": risk,

        "risk_score": score,

        "confidence": confidence

    }