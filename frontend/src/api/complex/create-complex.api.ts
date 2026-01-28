"use server"

import { ENV } from "@/configs/env.config";
import { apiFetch } from "@/lib/api-fetch";
import { getAuthHeaders } from "@/lib/utils";
import { IComplex } from "@/types";

export async function createComplex(data: Partial<IComplex>): Promise<IComplex> {
  return apiFetch("/complexes/add", { method: "POST", body: JSON.stringify(data) });
}
export async function updateComplex(
  id: number,
  data: Partial<IComplex>
): Promise<IComplex> {
  const headers = await getAuthHeaders();

  const res = await fetch(`${ENV.BASE_URL}/complexes/${id}/`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Update failed");
  }

  return res.json();
}