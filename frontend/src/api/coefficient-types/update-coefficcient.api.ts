"use server"

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { ICoefficientType, UpdateCoefficientTypePayload } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateCoefficientType(
  coefficientTypeId: number,
  data: UpdateCoefficientTypePayload
): Promise<ICoefficientType> {
  try {
    const headers = await getAuthHeaders();
    const requestData = {
      id: coefficientTypeId,
      name: data.name,
      rate: String(data.rate), 
      coefficient_id: data.coefficient_id
    };
    const res = await fetch(
      `${ENV.BASE_URL}/coefficient-types/${coefficientTypeId}`, 
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(requestData),
        cache: "no-store",
      }
    );
    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Backend Error Detail:", errorBody);
      throw new Error(`Server Error: ${res.status}`);
    }
    const result = await res.json();
    revalidatePath("/buildings");
    return result;
  } catch (error) {
    console.error("Action update error:", error);
    throw error;
  }
}