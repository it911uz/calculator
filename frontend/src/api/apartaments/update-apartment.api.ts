"use server"

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { IApartment } from "@/types";

export async function updateApartment(id: number, data: Partial<IApartment>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${ENV.BASE_URL}/apartments/${id}/`, {
      method: "PATCH", 
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Server validation error:", errorData);
      
      throw new Error(JSON.stringify(errorData.detail || errorData || "Update failed"));
    }

    return await res.json();
  } catch (error: unknown) {
    let message = "Noma'lum xatolik yuz berdi";

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    console.error("Action error:", message);
    throw new Error(message);
  
  }
}