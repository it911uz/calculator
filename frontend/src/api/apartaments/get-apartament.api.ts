"use server"
import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { IApartment } from "@/types";

export async function getApartmentById(id: number): Promise<IApartment | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ENV.BASE_URL}/apartments/${id}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch apartment: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching apartment:", error);
    return null;
  }
}