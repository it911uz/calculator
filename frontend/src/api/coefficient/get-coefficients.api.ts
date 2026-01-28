import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ICoefficient } from "@/types";

export async function getCoefficients(): Promise<ICoefficient[]> {
  try {
    const authData = await getAuthData();
    const res: Response = await fetch(`${ENV.BASE_URL}/coefficients/`, { 
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authData.access}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: "no-store" 
    });

    if (!res.ok) {
      console.error(`Koeffitsientlar ro'yxatini yuklashda xatolik: ${res.status}`);
      return [];
    }

    return (await res.json()) as ICoefficient[];
  } catch (error) {
    console.error("Coefficients fetch error:", error);
    return [];
  }
}