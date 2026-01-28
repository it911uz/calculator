import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ICoefficient } from "@/types";

export async function updateCoefficient(
  id: number,
  data: Partial<ICoefficient>
): Promise<ICoefficient> {
  const authData = await getAuthData();

  const res: Response = await fetch(`${ENV.BASE_URL}/coefficients/${id}/`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Yangilashda xatolik: ${res.status}`);
  }

  return (await res.json()) as ICoefficient;
}