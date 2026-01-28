import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import { IBuildings } from "@/types";

export async function updateBuilding(
  id: string | number,
  data: Partial<IBuildings>
): Promise<IBuildings> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(`${ENV.BASE_URL}/buildings/${id}/`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`Bino yangilashda xato: ${res.status} - ${errorText}`);
  }

  return (await res.json()) as IBuildings;
}