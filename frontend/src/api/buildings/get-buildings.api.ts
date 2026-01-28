"use server";

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { IBuildings } from "@/types";
import { redirect } from "next/navigation";

export async function getBuildings(): Promise<IBuildings[]> {
  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${ENV.BASE_URL}/buildings`, {
      headers,
      cache: 'no-store',
    });
    
    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to fetch buildings: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching buildings:', error);
    return [];
  }
}