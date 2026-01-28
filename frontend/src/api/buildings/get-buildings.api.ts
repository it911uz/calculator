import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import { IBuildings } from "@/types";

export async function getBuildings(): Promise<IBuildings[]> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(`${ENV.BASE_URL}/buildings/`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    cache: 'no-store',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Binolar kelmadi: ${res.status}`
    );
  }
  const data: IBuildings[] = await res.json();
  
  return data;
}