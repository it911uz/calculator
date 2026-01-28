"use server";

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";

export async function deleteCoefficient(id: number): Promise<{ success: boolean }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ENV.BASE_URL}/coefficients/${id}`, { method: "DELETE", headers });
    if (!res.ok) throw new Error("Failed to delete coefficient");
    return { success: true };
  } catch (error) {
    console.error("Error deleting coefficient:", error);
    throw error;
  }
}