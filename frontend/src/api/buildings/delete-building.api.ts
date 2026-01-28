import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";

export async function deleteBuilding(id: number): Promise<void> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(`${ENV.BASE_URL}/buildings/${id}/`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
    },
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Bino o'chirishda xatolik: ${res.status}`);
  }
}