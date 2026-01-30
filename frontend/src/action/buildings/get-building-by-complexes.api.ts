import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IBuildings, SafeArray } from "@/types";
export async function getBuildingsByComplexId(complexId: string | number) {
  const result: SafeArray<IBuildings> = [];
  try {
    const authData = await getAuthData();
    if (!authData?.access) {
      result._meta = { status: 401, error: "Token topilmadi", reason: "TOKEN" };
      return result;
    }
    const res = await fetch(`${ENV.BASE_URL}/buildings/?complex_id=${complexId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authData.access}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      result._meta = { status: res.status, error: "Server xatosi", reason: "HTTP" };
      return result;
    }
    const json = await res.json();
    const data = Array.isArray(json) ? json : json?.data;
    if (Array.isArray(data)) {
      result.push(...data);
    } else {
      result._meta = { status: res.status, error: "Noto'g'ri format", reason: "PARSE" };
    }
    return result;
  } catch (error) {
    result._meta = {
      status: 500,
      error: error instanceof Error ? error.message : "Noma'lum xato",
      reason: "UNKNOWN",
    };
    return result;
  }
}