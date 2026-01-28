import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";

export async function deleteComplex(id: number): Promise<void> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(`${ENV.BASE_URL}/complexes/${id}/`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorDetail = await res.text().catch(() => "Unknown error");
    throw new Error(`Ochirishda xatolik: ${res.status} - ${errorDetail}`);
  }
}