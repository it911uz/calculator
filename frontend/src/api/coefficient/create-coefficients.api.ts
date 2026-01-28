import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { CreateCoefficientPayload, ICoefficient } from "@/types";

export async function createCoefficient(data: CreateCoefficientPayload): Promise<ICoefficient> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(`${ENV.BASE_URL}/coefficients/add/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authData.access}`, 
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Koeffitsient yaratishda xatolik: ${res.status}`);
  }

  return (await res.json()) as ICoefficient;
}