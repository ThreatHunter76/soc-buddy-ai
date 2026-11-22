import requests
from requests.auth import HTTPBasicAuth


class WazuhIndexer:

    def __init__(self):
        self.host = "https://192.168.0.133:9200"
        self.username = "admin"
        self.password = "admin"


    def get_latest_alerts(self, limit=10, event_ids=None):

        url = f"{self.host}/wazuh-alerts-*/_search"


        query = {
            "size": limit,
            "sort": [
                {
                    "timestamp": {
                        "order": "desc"
                    }
                }
            ]
        }


        if event_ids:

            query["query"] = {
                "terms": {
                    "data.win.system.eventID": event_ids
                }
            }


        response = requests.get(
            url,
            json=query,
            auth=HTTPBasicAuth(
                self.username,
                self.password
            ),
            verify=False
        )


        response.raise_for_status()


        data = response.json()


        alerts = []


        for hit in data["hits"]["hits"]:

            alerts.append(
                hit["_source"]
            )


        return alerts