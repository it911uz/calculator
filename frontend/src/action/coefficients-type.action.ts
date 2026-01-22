"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ICoefficientType, ICoefficientTypeGroup } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.120:8000";

// Auth headers olish
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

// GET all coefficient types
export async function getCoefficientTypes(): Promise<ICoefficientType[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficient-types`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Failed to fetch coefficient types: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching coefficient types:", error);
    return [];
  }
}

// GET coefficient types by building ID
export async function getCoefficientTypesByBuildingId(
  buildingId: number
): Promise<ICoefficientTypeGroup[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficients-common/bcs-with-bcts-by-building-id/${buildingId}`, {
      headers,
      cache: "no-store",
    });

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

// POST create coefficient type
export async function createCoefficientType(data: Partial<ICoefficientType>): Promise<ICoefficientType> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficient-types/add`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Failed to create coefficient type: ${res.status}`);
    const result = await res.json();
    // revalidatePath("/coefficient-types");
    // revalidatePath(`/buildings/${data.building_id}`);
    return result;
  } catch (error) {
    console.error("Error creating coefficient type:", error);
    throw error;
  }
}

// PUT update coefficient type
export async function updateCoefficientType(
  id: number,
  data: Partial<ICoefficientType>
): Promise<ICoefficientType> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficient-types/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Failed to update coefficient type: ${res.status}`);
    const result = await res.json();
    revalidatePath("/coefficient-types");
    revalidatePath(`/buildings/${data.building_id}`);
    return result;
  } catch (error) {
    console.error("Error updating coefficient type:", error);
    throw error;
  }
}

// DELETE coefficient type
export async function deleteCoefficientType(id: number): Promise<{ success: boolean }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficient-types/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) throw new Error(`Failed to delete coefficient type: ${res.status}`);
    revalidatePath("/coefficient-types");
    return { success: true };
  } catch (error) {
    console.error("Error deleting coefficient type:", error);
    throw error;
  }
}
