from app.services.parser import parse_log
from app.services.detector import detect_events
from app.services.mitre_mapper import map_mitre
from app.services.ioc_extractor import extract_iocs
from app.services.risk_engine import calculate_risk
from app.services.report_writer import generate_report



def analyze_log(log_text: str):

    # 1. Parse raw log
    parsed_log = parse_log(log_text)


    # 2. Detect security events
    detections = detect_events(parsed_log)


    # 3. Map detections to MITRE ATT&CK
    mitre_results = map_mitre(detections)


    # 4. Extract indicators
    iocs = extract_iocs(parsed_log)


    # 5. Calculate risk
    risk = calculate_risk(
        detections,
        iocs,
        mitre_results
    )


    # 6. Generate final SOC report
    report = generate_report(
        detections,
        mitre_results,
        iocs,
        risk
    )


    # Extra information for debugging and future UI
    report["raw_analysis"] = {

        "detections": detections,

        "parsed_data": parsed_log

    }


    return report