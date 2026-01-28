import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IApartment } from "@/types";

export async function getApartments(): Promise<IApartment[]> {
  const authData = await getAuthData();

  const res = await fetch(`${ENV.BASE_URL}/apartments/`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${authData.access}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    next: { revalidate: 3600 } 
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `getApartments topilmadi: ${res.status} ${res.statusText}`
    );
  }

  const data: IApartment[] = await res.json();
  return data;
}