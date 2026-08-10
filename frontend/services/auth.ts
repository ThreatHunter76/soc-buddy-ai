const API_URL = "http://127.0.0.1:8000/api/v1";

export async function login(email: string, password: string) {
  const body = new URLSearchParams();

  body.append("username", email);
  body.append("password", password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const data = await response.json();

  localStorage.setItem(
    "access_token",
    data.access_token
  );

  document.cookie = `access_token=${data.access_token}; path=/`;

  return data;
}

export function logout() {
  localStorage.removeItem("access_token");

  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}