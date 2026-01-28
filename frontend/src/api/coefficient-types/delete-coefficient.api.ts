import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
export async function deleteCoefficientType(
  id: number,
): Promise<void> {
  const authData = await getAuthData();

  const res: Response = await fetch(`${ENV.BASE_URL}/coefficient-types/${id}/`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Koeffitsient type o'chirishda xatolik: ${res.status}`);
  }
}