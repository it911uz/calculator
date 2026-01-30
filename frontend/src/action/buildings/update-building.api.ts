import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IBuildings, SafeObject } from "@/types";



export async function updateBuilding(id: string | number, payload: Partial<IBuildings>) {
  const result: SafeObject<IBuildings> = { data: null };

  try {
    const auth = await getAuthData();

    if (!auth?.access) {
      result._meta = { 
        status: 401, 
        error: "Sessiya muddati tugagan", 
        reason: "TOKEN" 
      };
      return result;
    }

    const res = await fetch(`${ENV.BASE_URL}/buildings/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${auth.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      result._meta = { 
        status: res.status, 
        error: `Binoni yangilashda xatolik: ${res.status}`, 
        reason: "HTTP" 
      };
      return result;
    }

    const data = await res.json();
    result.data = data as IBuildings;
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