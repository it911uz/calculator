"use server"

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteApartment(
  id: number,
): Promise<{ success: boolean }> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${ENV.BASE_URL}/apartments/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to delete apartment: ${res.status}`);
    }

    revalidatePath("/apartments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting apartment:", error);
    throw error;
  }
}