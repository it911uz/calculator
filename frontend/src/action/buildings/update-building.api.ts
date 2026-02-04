import { ENV } from "@/configs/env.config";
import { createSearchParams } from "@/lib/api.util";
import { getAuthData } from "@/lib/auth.util";
import type { IBuildings, SafeObject } from "@/types";

export async function updateBuilding(
  id: string | number,
  payload: Partial<IBuildings>,
  params: Record<string, unknown> = {}
): Promise<SafeObject<IBuildings>> {
  const result: SafeObject<IBuildings> = { data: null };
  const searchParams = createSearchParams(params).toString();
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

    const res = await fetch( `${ENV.BASE_URL}/buildings/${id}/${searchParams ? `?${searchParams}` : ""}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${auth.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = (await res.json().catch(() => ({}))) as { detail?: string };
      result._meta = { 
        status: res.status, 
        error: errorData.detail || `Binoni yangilashda xatolik: ${res.status}`, 
        reason: "HTTP" 
      };
      return result;
    }

    result.data = (await res.json()) as IBuildings;
    return result;

  } catch (error: unknown) {
    result._meta = { 
      status: 500, 
      error: error instanceof Error ? error.message : "Noma'lum server xatoligi", 
      reason: "UNKNOWN" 
    };
    return result;
  }
}