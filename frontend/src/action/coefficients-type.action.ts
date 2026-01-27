"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ICoefficientType, ICoefficientTypeGroup, UpdateCoefficientTypePayload } from "@/types";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.120:8000";
// auth
export async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}
// getAll
export async function getCoefficientTypes(): Promise<ICoefficientType[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficient-types`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok)
      throw new Error(`Failed to fetch coefficient types: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching coefficient types:", error);
    return [];
  }
}

// get
export async function getCoefficientTypesByBuildingId(
  buildingId: number,
): Promise<ICoefficientTypeGroup[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${BASE_URL}/coefficients-common/bcs-with-bcts-by-building-id/${buildingId}`,
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

// post
export async function createCoefficientType(
  data: Partial<ICoefficientType>,
): Promise<ICoefficientType> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficient-types/add`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok)
      throw new Error(`Failed to create coefficient type: ${res.status}`);
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error creating coefficient type:", error);
    throw error;
  }
}

// update
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
      `${BASE_URL}/coefficient-types/${coefficientTypeId}`, 
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
//delete
export async function deleteCoefficientType(
  id: number,
): Promise<{ success: boolean }> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${BASE_URL}/coefficient-types/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to delete coefficient: ${res.status}`);
    }

    revalidatePath("/buildings");
    return { success: true };
  } catch (error) {
    console.error("Error deleting building:", error);
    throw error;
  }
}
