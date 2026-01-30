import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ComplexArray } from "@/types";


function hasDataArray(value: unknown): value is { data: unknown[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as { data: unknown[] }).data)
  );
}

export async function getComplexes() {
  const result: ComplexArray = [];

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

    const response = await fetch(`${ENV.PUBLIC_API_URL}/complexes`, {
      headers: {
        Authorization: `Bearer ${auth.access}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      result._meta = {
        status: response.status,
        error: `HTTP error ${response.status}`,
        reason: "HTTP",
      };
      return result;
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      result._meta = {
        status: response.status,
        error: "Invalid JSON response",
        reason: "PARSE",
      };
      return result;
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (hasDataArray(data)) {
      return data.data;
    }

    result._meta = {
      status: response.status,
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
