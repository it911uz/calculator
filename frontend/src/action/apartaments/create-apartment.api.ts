import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IApartment, SafeObject } from "@/types";
export async function createApartment(payload: Partial<IApartment>) {
  const result: SafeObject<IApartment> = { data: null };
  try {
    const authData = await getAuthData();
    if (!authData?.access) {
      result._meta = { status: 401, error: "Token topilmadi", reason: "TOKEN" };
      return result;
    }
    const res = await fetch(`${ENV.BASE_URL}/apartments/add/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authData.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      result._meta = { 
        status: res.status, 
        error: errorData?.detail || `Xatolik: ${res.status}`, 
        reason: "HTTP" 
      };
      return result;
    }
    result.data = await res.json();
    return result;

  } catch (error) {
    result._meta = { 
      status: 500, 
      error: error instanceof Error ? error.message : "Noma'lum xatolik", 
      reason: "UNKNOWN" 
    };
    return result;
  }
}