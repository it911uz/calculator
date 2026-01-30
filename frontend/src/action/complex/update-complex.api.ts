import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IComplex, SafeObject } from "@/types";


export async function updateComplex(id: string | number, payload: Partial<IComplex>) {
  const result: SafeObject<IComplex> = { data: null };

  try {
    const auth = await getAuthData();

    if (!auth?.access) {
      result._meta = { status: 401, error: "Token topilmadi", reason: "TOKEN" };
      return result;
    }

    const res = await fetch(`${ENV.BASE_URL}/complexes/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${auth.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      result._meta = { status: res.status, error: "Yangilashda xato", reason: "HTTP" };
      return result;
    }

    const data = await res.json();
    result.data = data as IComplex;
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