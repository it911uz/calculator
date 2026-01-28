"use server"

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { ICoefficient } from "@/types";

export async function getCoefficients(): Promise<ICoefficient[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ENV.BASE_URL}/coefficients`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch coefficients");
    return await res.json();
  } catch (error) {
    console.error("Error fetching coefficients:", error);
    return [];
  }
}