"use server";

import { CreateCoefficientPayload, CreateCoefficientTypePayload, ICoefficient } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.120:8000";



// Auth headers olish
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

// GET all coefficients
export async function getCoefficients(): Promise<ICoefficient[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficients`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch coefficients");
    return await res.json();
  } catch (error) {
    console.error("Error fetching coefficients:", error);
    return [];
  }
}

// GET coefficient by ID
export async function getCoefficientById(id: number): Promise<ICoefficient | null> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficients/${id}`, { headers, cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch coefficient");
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching coefficient:", error);
    return null;
  }
}

// CREATE coefficient
export async function createCoefficient(data: CreateCoefficientPayload): Promise<ICoefficient> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficients/add`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create coefficient");
    const result = await res.json();
    revalidatePath(`/buildings/${data.building_id}`);
    return result;
  } catch (error) {
    console.error("Error creating coefficient:", error);
    throw error;
  }
}

// UPDATE coefficient
export async function updateCoefficient(
  id: number,
  data: Partial<ICoefficient>
): Promise<ICoefficient> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficients/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update coefficient");
    const result = await res.json();
    revalidatePath(`/buildings/${data.building_id}`);
    return result;
  } catch (error) {
    console.error("Error updating coefficient:", error);
    throw error;
  }
}

// DELETE coefficient
export async function deleteCoefficient(id: number): Promise<{ success: boolean }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/coefficients/${id}`, { method: "DELETE", headers });
    if (!res.ok) throw new Error("Failed to delete coefficient");
    return { success: true };
  } catch (error) {
    console.error("Error deleting coefficient:", error);
    throw error;
  }
}
