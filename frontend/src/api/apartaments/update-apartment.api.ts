import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IApartment } from "@/types";

export async function updateApartment(id: number, data: Partial<IApartment>) {
  const authData = await getAuthData();

  const res = await fetch(`${ENV.BASE_URL}/apartments/${id}/`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${authData.access}`, 
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Update apartment ishlamadi");
  return res.json();
}