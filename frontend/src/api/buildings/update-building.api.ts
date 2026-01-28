"use server";

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { IBuildings } from "@/types";

export async function updateBuilding(
  id: string | number,
  data: Partial<IBuildings>
) {
  const headers = await getAuthHeaders(); 
  headers["Content-Type"] = "application/json";

  const res = await fetch(`${ENV.BASE_URL}/buildings/${id}/`, { 
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update building: ${text}`);
  }

  return res.json();
}