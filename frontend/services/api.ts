const API_URL = "http://127.0.0.1:8000/api/v1";

export async function getIncidents() {
  const response = await fetch(`${API_URL}/incidents/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch incidents: ${response.status}`);
  }

  return response.json();
}

export async function getIncident(id: number) {
  const response = await fetch(`${API_URL}/incidents/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch incident: ${response.status}`);
  }

  return response.json();
}

export async function analyzeIncident(id: number) {
  const response = await fetch(
    `${API_URL}/incidents/${id}/analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to analyze incident: ${response.status} ${errorText}`
    );
  }

  return response.json();
}