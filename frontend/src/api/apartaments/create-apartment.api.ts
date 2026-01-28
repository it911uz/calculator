import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { FastApiErrorResponse, IApartment } from "@/types";

export async function createApartment(
  data: Partial<IApartment>,
): Promise<IApartment> {
  const authData = await getAuthData();
  const apiUrl = `${ENV.BASE_URL}/apartments/add/`; 

  const res: Response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = `Error ${res.status}`;

    try {
      const errorJson = (await res.json()) as FastApiErrorResponse;
      errorMessage = Array.isArray(errorJson.detail)
        ? errorJson.detail.map((err) => `${err.loc.at(-1)}: ${err.msg}`).join(", ")
        : errorJson.detail || errorMessage;
    } catch {
      const text = await res.text();
      errorMessage = text || errorMessage;
    }

    throw new Error(errorMessage);
  }

  return (await res.json()) as IApartment;
}