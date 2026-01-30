import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { SafeDelete } from "@/types";
export async function deleteBuilding(id: string | number) {
  const result: SafeDelete = { success: false };
  try {
    const auth = await getAuthData();

    if (!auth?.access) {
      result._meta = { 
        status: 401, 
        error: "Avtorizatsiya xatosi: Token topilmadi", 
        reason: "TOKEN" 
      };
      return result;
    }

    const res = await fetch(`${ENV.BASE_URL}/buildings/${id}/`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${auth.access}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      result._meta = { 
        status: res.status, 
        error: `Binoni o'chirishda xatolik: ${res.status}`, 
        reason: "HTTP" 
      };
      return result;
    }

    result.success = true;
    result._meta = { status: res.status, reason: "HTTP" };
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