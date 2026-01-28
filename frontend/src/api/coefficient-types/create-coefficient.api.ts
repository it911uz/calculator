import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ICoefficientType } from "@/types";

export async function createCoefficientType(
  data: Partial<ICoefficientType>,
): Promise<ICoefficientType> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(`${ENV.BASE_URL}/coefficient-types/add/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `postda xatolik: ${res.status}`);
  }

  return (await res.json()) as ICoefficientType;
}