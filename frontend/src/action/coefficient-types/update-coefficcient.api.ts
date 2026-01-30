import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ICoefficientType, SafeObject, UpdateCoefficientTypePayload } from "@/types";



export async function updateCoefficientType(
  coefficientTypeId: string | number,
  payload: UpdateCoefficientTypePayload
) {
  const result: SafeObject<ICoefficientType> = { data: null };

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
    const requestBody = {
      id: coefficientTypeId,
      name: payload.name,
      rate: String(payload.rate), 
      coefficient_id: payload.coefficient_id
    };
    const res = await fetch(`${ENV.BASE_URL}/coefficient-types/${coefficientTypeId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${auth.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });
    if (!res.ok) {
      result._meta = { 
        status: res.status, 
        error: `Yangilashda xatolik: ${res.status}`, 
        reason: "HTTP" 
      };
      return result;
    }
    const data = await res.json();
    result.data = data as ICoefficientType;
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