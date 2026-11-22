from app.services.wazuh_indexer import WazuhIndexer
from app.services.wazuh_analyzer import analyze_wazuh_alert


wazuh = WazuhIndexer()


alerts = wazuh.get_latest_alerts(
    50,
    event_ids=[
        "4625",
        "4624",
        "4720",
        "4672",
        "4697",
        "1102"
    ]
)


if not alerts:
    print("No security alerts found")
    exit()


selected_alert = alerts[0]


report = analyze_wazuh_alert(selected_alert)


print(report)