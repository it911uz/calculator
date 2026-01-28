"use server"

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { ICoefficientTypeGroup } from "@/types";

export async function getCoefficientTypesByBuildingId(
  buildingId: number,
): Promise<ICoefficientTypeGroup[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${ENV.BASE_URL}/coefficients-common/bcs-with-bcts-by-building-id/${buildingId}`,
      {
        headers,
        cache: "no-store",
      },
    );

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`Failed to fetch coefficient types: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching coefficient types:", error);
    return [];
  }
}