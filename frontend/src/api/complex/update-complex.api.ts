import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IComplex } from "@/types";

export async function updateComplex(
  id: number,
  data: Partial<IComplex>
): Promise<IComplex> {
  const authData = await getAuthData();

  const res: Response = await fetch(`${ENV.BASE_URL}/complexes/${id}/`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Kompleksni yangilanmadi");
  }

  return (await res.json()) as IComplex;
}