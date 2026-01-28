"use server";

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { IBuildings } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBuilding(data: Partial<IBuildings>): Promise<IBuildings> {
  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${ENV.BASE_URL}/buildings/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to create building: ${res.status}`);
    }
    
    const result = await res.json();
    
    revalidatePath('/buildings');
    revalidatePath(`/complex/${data.complex_id}`);
    return result;
  } catch (error) {
    console.error('Error creating building:', error);
    throw error;
  }
}