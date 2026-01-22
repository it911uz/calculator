import { getCookie } from "cookies-next";

const BASE_URL = "http://192.168.1.120:8000";

export async function fetchComplexes() {
  const token = getCookie("access_token");

  if (!token) throw new Error("No token");

  const res = await fetch(`${BASE_URL}/complex`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch complexes");
  }

  return res.json();
}
