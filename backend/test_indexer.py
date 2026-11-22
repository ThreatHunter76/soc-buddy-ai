from app.services.wazuh_indexer import WazuhIndexer

wazuh = WazuhIndexer()

alerts = wazuh.get_latest_alerts(1)

print(alerts[0])