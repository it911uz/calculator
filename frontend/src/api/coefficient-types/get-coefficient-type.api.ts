import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ICoefficientTypeGroup } from "@/types";

export async function getCoefficientTypesByBuildingId(
  buildingId: number,
): Promise<ICoefficientTypeGroup[]> {
  const authData = await getAuthData();
  
  const res: Response = await fetch(
    `${ENV.BASE_URL}/coefficients-common/bcs-with-bcts-by-building-id/${buildingId}/`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authData.access}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Koeffitsient type kemadi ${res.status}`
    );
  }

  const data: ICoefficientTypeGroup[] = await res.json();
  
  return data;
}