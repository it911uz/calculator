import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IApartment, SafeArray } from "@/types";



function hasDataArray<T>(value: unknown): value is { data: T[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as { data: T[] }).data)
  );
}

export async function getApartments() {
  const result: SafeArray<IApartment> = [];

  try {
    const authData = await getAuthData();

    if (!authData?.access) {
      result._meta = {
        status: 401,
        error: "Unauthorized token",
        reason: "TOKEN",
      };
      return result;
    }

    const res = await fetch(`${ENV.BASE_URL}/apartments/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authData.access}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
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
      return data;
    }

    if (hasDataArray<IApartment>(data)) {
      return data.data;
    }

    result._meta = {
      status: res.status,
      error: "Unknown response format",
      reason: "UNKNOWN",
    };
    return result;

  } catch {
    result._meta = {
      status: 500,
      error: "Unexpected server error",
      reason: "UNKNOWN",
    };
    return result;
  }
}
