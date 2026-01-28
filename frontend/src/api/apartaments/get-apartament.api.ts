import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { IApartment } from "@/types";

export async function getApartmentById(id: number): Promise<IApartment> {
  const authData = await getAuthData();

  try {
    const res = await fetch(`${ENV.BASE_URL}/apartments/${id}/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authData.access}`, 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      switch (res.status) {
        case 401: throw new Error("Avtorizatsiyadan o'tilmagan");
        case 404: throw new Error("Xonadon topilmadi");
        default:  throw new Error(`Server xatosi: ${res.status}`);
      }
    }

    return (await res.json()) as IApartment;
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Kutilmagan xatolik yuz berdi");
  }
}