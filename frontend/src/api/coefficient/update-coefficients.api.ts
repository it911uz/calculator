"use server"

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { ICoefficient } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateCoefficient(
  id: number,
  data: Partial<ICoefficient>
): Promise<ICoefficient> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ENV.BASE_URL}/coefficients/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update coefficient");
    const result = await res.json();
    revalidatePath(`/buildings/${data.building_id}`);
    return result;
  } catch (error) {
    console.error("Error updating coefficient:", error);
    throw error;
  }
}