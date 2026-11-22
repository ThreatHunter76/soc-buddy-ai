from app.services.parser import parse_wazuh_alert
from app.services.detector import detect_events
from app.services.mitre_mapper import map_mitre
from app.services.ioc_extractor import extract_iocs
from app.services.risk_engine import calculate_risk
from app.services.report_writer import generate_report


def analyze_wazuh_alert(alert: dict):

    parsed_log = parse_wazuh_alert(alert)

    print("DEBUG WAZUH PARSED:")
    print(parsed_log)

    detections = detect_events(parsed_log)

    mitre_results = map_mitre(detections)

    iocs = extract_iocs(parsed_log)

    risk = calculate_risk(
        detections,
        iocs,
        mitre_results
    )

    report = generate_report(
        detections,
        mitre_results,
        iocs,
        risk
    )

    report["raw_analysis"] = {

        "detections": detections,

        "parsed_data": parsed_log

    }

    return report