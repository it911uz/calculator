"use server";

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { ICoefficientType } from "@/types";

export async function createCoefficientType(
  data: Partial<ICoefficientType>,
): Promise<ICoefficientType> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ENV.BASE_URL}/coefficient-types/add`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok)
      throw new Error(`Failed to create coefficient type: ${res.status}`);
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error creating coefficient type:", error);
    throw error;
  }
}