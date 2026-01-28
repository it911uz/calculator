import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import type { ICoefficientType, UpdateCoefficientTypePayload } from "@/types";

export async function updateCoefficientType(
  coefficientTypeId: number,
  data: UpdateCoefficientTypePayload
): Promise<ICoefficientType> {
  const authData = await getAuthData();

  const requestBody = {
    id: coefficientTypeId,
    name: data.name,
    rate: String(data.rate), 
    coefficient_id: data.coefficient_id
  };

  const res: Response = await fetch(
    `${ENV.BASE_URL}/coefficient-types/${coefficientTypeId}/`, 
    {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${authData.access}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "Unknown error");
    throw new Error(`Yangilashda xatolik: ${res.status} - ${errorBody}`);
  }

  return (await res.json()) as ICoefficientType;
}