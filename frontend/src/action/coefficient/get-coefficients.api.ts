import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ICoefficient, SafeArrayGetCoefficient } from "@/types";



export async function getCoefficients() {
  const result: SafeArrayGetCoefficient<ICoefficient> = { data: [] };

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

    const res = await fetch(`${ENV.BASE_URL}/coefficients/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.access}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      result._meta = {
        status: res.status,
        error: `HTTP error ${res.status}`,
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
      result.data = data as ICoefficient[];
      return result;
    }

    result._meta = {
      status: res.status,
      error: "Unknown response format",
      reason: "UNKNOWN",
    };
    return result;

  } catch (error) {
    result._meta = {
      status: 500,
      error: error instanceof Error ? error.message : "Unexpected server error",
      reason: "UNKNOWN",
    };
    return result;
  }
}
