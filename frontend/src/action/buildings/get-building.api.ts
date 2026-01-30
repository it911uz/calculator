import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IBuildings, SafeObject } from "@/types";


export async function getBuildingById(id: string | number) {
  const result: SafeObject<IBuildings> = { data: null };
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

    const res = await fetch(`${ENV.BASE_URL}/buildings/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authData.access}`,
        "Content-Type": "application/json",
        Accept: "application/json",
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
    if (data && typeof data === "object") {
      result.data = data as IBuildings;
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
