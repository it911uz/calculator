import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ICoefficientType, SafeArrayGetCoefficient } from "@/types";



export async function getCoefficientTypes() {
  const result: SafeArrayGetCoefficient<ICoefficientType> = { data: [] };

  try {
    const auth = await getAuthData();

    if (!auth?.access) {
      result._meta = {
        status: 401,
        error: "Unauthorized token",
        reason: "TOKEN",
      };
      return result;
    }

    const res = await fetch(`${ENV.BASE_URL}/coefficient-types/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${auth.access}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      result._meta = {
        status: res.status,
        error: errorData.detail || `HTTP error ${res.status}`,
        reason: "HTTP",
      };
      return result;
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      result._meta = {
        status: res.status,
        error: "Invalid JSON response",
        reason: "PARSE",
      };
      return result;
    }

    if (Array.isArray(data)) {
      result.data = data as ICoefficientType[];
      return result;
    }

    result._meta = {
      status: res.status,
      error: "Unknown response format",
      reason: "UNKNOWN",
    };
    return result;

  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unexpected server error");
    result._meta = {
      status: 500,
      error: err.message,
      reason: "UNKNOWN",
    };
    return result;
  }
}
