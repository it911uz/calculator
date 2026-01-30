import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IComplex, SafeObject } from "@/types";



export async function getComplexById(id: string | number) {
  const result: SafeObject<IComplex> = { data: null };

  try {
    const auth = await getAuthData();

    if (!auth?.access) {
      result._meta = { status: 401, error: "Token topilmadi", reason: "TOKEN" };
      return result;
    }
    const res = await fetch(`${ENV.BASE_URL}/complexes/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.access}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
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
      error: error instanceof Error ? error.message : "Server xatosi", 
      reason: "UNKNOWN" 
    };
    return result;
  }
}