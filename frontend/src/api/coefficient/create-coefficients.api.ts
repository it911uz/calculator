"use server";

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { CreateCoefficientPayload, ICoefficient } from "@/types";
import { revalidatePath } from "next/cache";

export async function createCoefficient(data: CreateCoefficientPayload): Promise<ICoefficient> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ENV.BASE_URL}/coefficients/add`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create coefficient");
    const result = await res.json();
    revalidatePath(`/buildings/${data.building_id}`);
    return result;
  } catch (error) {
    console.error("Error creating coefficient:", error);
    throw error;
  }
}