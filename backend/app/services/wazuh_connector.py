import requests
import urllib3

urllib3.disable_warnings()


class WazuhConnector:

    def __init__(self, host, username, password):
        self.host = host.rstrip("/")
        self.username = username
        self.password = password
        self.token = None


    def authenticate(self):

        url = f"{self.host}/security/user/authenticate"

        response = requests.get(
            url,
            auth=(self.username, self.password),
            verify=False
        )

        response.raise_for_status()

        self.token = response.json()["data"]["token"]

        return self.token


    def headers(self):

        if not self.token:
            self.authenticate()

        return {
            "Authorization": f"Bearer {self.token}"
        }


    def get_alerts(self, limit=20):

        url = (
    f"{self.host}"
    f"/security/events"
    f"?limit={limit}"
)

        response = requests.get(
            url,
            headers=self.headers(),
            verify=False
        )

        response.raise_for_status()

        return response.json()


    def get_agents(self):

        url = f"{self.host}/agents"

        response = requests.get(
            url,
            headers=self.headers(),
            verify=False
        )

        response.raise_for_status()

        return response.json()