"use server"
import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { IApartment } from "@/types";
import { redirect } from "next/navigation";

export async function getApartments(): Promise<IApartment[]> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${ENV.BASE_URL}/apartments`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to fetch apartments: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching apartments:", error);
    return [];
  }
}