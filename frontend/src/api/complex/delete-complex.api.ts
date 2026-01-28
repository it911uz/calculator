"use server"

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";

export async function deleteComplex(id: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${ENV.BASE_URL}/complexes/${id}/`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }
}