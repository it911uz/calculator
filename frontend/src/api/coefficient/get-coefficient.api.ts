import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ICoefficient } from "@/types";

export async function getCoefficientById(id: number): Promise<ICoefficient | null> {
  try {
    const authData = await getAuthData();
    const res: Response = await fetch(`${ENV.BASE_URL}/coefficients/${id}/`, { 
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authData.access}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: "no-store" 
    });

    if (!res.ok) {
      console.error(`Koeffitsient yuklashda xatolik: ${res.status}`);
      return null;
    }

    return (await res.json()) as ICoefficient;
  } catch (error) {
    console.error("Fetch coefficient error:", error);
    return null;
  }
}