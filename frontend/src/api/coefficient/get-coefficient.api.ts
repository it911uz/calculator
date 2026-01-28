"use server";

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { ICoefficient } from "@/types";

export async function getCoefficientById(id: number): Promise<ICoefficient | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ENV.BASE_URL}/coefficients/${id}`, { headers, cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch coefficient");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching coefficient:", error);
    return null;
  }
}