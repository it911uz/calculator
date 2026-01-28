"use server"

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { ICoefficientType } from "@/types";

export async function getCoefficientTypes(): Promise<ICoefficientType[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ENV.BASE_URL}/coefficient-types`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok)
      throw new Error(`Failed to fetch coefficient types: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching coefficient types:", error);
    return [];
  }
}