import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IBuildings } from "@/types";

export async function createBuilding(data: Partial<IBuildings>): Promise<IBuildings> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(`${ENV.BASE_URL}/buildings/add/`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${authData.access}`, 
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Binoni yaratib bo'lmadi: ${res.status}`);
  }
  
  return (await res.json()) as IBuildings;
}