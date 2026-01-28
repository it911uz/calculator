import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";

export async function deleteApartment(id: number): Promise<void> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(`${ENV.BASE_URL}/apartments/${id}/`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorDetail = await res.text().catch(() => "deleteApartmentda xatolik");
    throw new Error(`O'chirishda xatolik: ${res.status} - ${errorDetail}`);
  }
}