import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { SafeDelete } from "@/types";


export async function deleteCoefficient(id: string | number) {
  const result: SafeDelete = { success: false };

  try {
    const authData = await getAuthData();
    if (!authData?.access) {
      result._meta = { 
        status: 401, 
        error: "Token topilmadi", 
        reason: "TOKEN" 
      };
      return result;
    }
    const res = await fetch(`${ENV.BASE_URL}/coefficients/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authData.access}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      result._meta = { 
        status: res.status, 
        error: `Koeffitsientni o'chirishda xato: ${res.status}`, 
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
      error: error instanceof Error ? error.message : "Server xatosi", 
      reason: "UNKNOWN" 
    };
    return result;
  }
}