import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IBuildings } from "@/types";

export async function getBuildingsByComplexId(
  complexId: string | number
): Promise<IBuildings[]> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(
    `${ENV.BASE_URL}/buildings/?complex_id=${complexId}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authData.access}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: 'no-store',
    }
  );
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Binoni olishda xatolik: ${res.status}`
    );
  }

  const data: IBuildings[] = await res.json();
  
  return data;
}