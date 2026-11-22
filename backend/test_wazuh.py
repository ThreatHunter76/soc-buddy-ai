from app.services.wazuh_connector import WazuhConnector


wazuh = WazuhConnector(
    host="https://192.168.0.133:55000",
    username="wazuh",
    password="Wazuh2026$$"
)


token = wazuh.authenticate()

print("Authentication successful")

alerts = wazuh.get_alerts()

print("\nAlerts:")
print(alerts)