import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ICoefficientType } from "@/types";

export async function getCoefficientTypes(): Promise<ICoefficientType[]> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(`${ENV.BASE_URL}/coefficient-types/`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Koeffitsient type kemqdi: ${res.status}`
    );
  }

  const data: ICoefficientType[] = await res.json();
  
  return data;
}