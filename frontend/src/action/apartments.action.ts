// actions/apartments.action.ts
"use server";

import { FastApiErrorResponse, IApartment } from "@/types";
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

// GET all apartments
export async function getApartments(): Promise<IApartment[]> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${BASE_URL}/apartments`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to fetch apartments: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching apartments:", error);
    return [];
  }
}

// GET apartment by ID
export async function getApartmentById(
  id: string | number,
): Promise<IApartment | null> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${BASE_URL}/apartments/${id}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to fetch apartment: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching apartment:", error);
    return null;
  }
}

// GET apartments by building ID
export async function getApartmentsByBuildingId(
  buildingId: string | number,
): Promise<IApartment[]> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(
      `${BASE_URL}/apartments?building_id=${buildingId}`,
      {
        headers,
        cache: "no-store",
      },
    );

    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to fetch apartments by building: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching apartments by building:", error);
    return [];
  }
}

// POST create apartment
export async function createApartment(
  data: Partial<IApartment>,
): Promise<IApartment> {
  try {
    const headers = await getAuthHeaders();
    const apiUrl = `${BASE_URL}/apartments/add`;

    console.log(" Отправка запроса на:", apiUrl);
    console.log(" Отправляемые данные:", JSON.stringify(data, null, 2));
    console.log(
      " Используемый токен:",
      headers.Authorization ? "Present" : "Missing",
    );

    const res = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    console.log("📥 Ответ сервера:", {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      url: res.url,
    });

    if (!res.ok) {
      if (res.status === 401) redirect("/login");

      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;

      try {
        const errorJson = (await res.json()) as FastApiErrorResponse;
        console.error("JSON ошибка:", errorJson);

        if (errorJson.detail) {
          if (Array.isArray(errorJson.detail)) {
            errorMessage = errorJson.detail
              .map((err) => `${err.loc.join(".")}: ${err.msg}`)
              .join(", ");
          } else if (typeof errorJson.detail === "string") {
            errorMessage = errorJson.detail;
          }
        }
      } catch {
        const text = await res.text();
        errorMessage = text || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const result = await res.json();
    console.log("✅ Успешный ответ:", result);

    revalidatePath("/apartments");
    revalidatePath(`/buildings/${data.building_id}`);
    revalidatePath(`/dashboard`);

    return result;
  } catch (error) {
    console.error("❌ Общая ошибка создания квартиры:", error);
    throw error;
  }
}

// PUT update apartment
export async function updateApartment(
  id: number,
  data: Partial<IApartment>,
): Promise<IApartment> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${BASE_URL}/apartments/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to update apartment: ${res.status}`);
    }

    const result = await res.json();

    revalidatePath("/apartments");
    revalidatePath(`/apartments/${id}`);
    if (data.building_id) {
      revalidatePath(`/buildings/${data.building_id}`);
    }

    return result;
  } catch (error) {
    console.error("Error updating apartment:", error);
    throw error;
  }
}

// DELETE apartment
export async function deleteApartment(
  id: number,
): Promise<{ success: boolean }> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${BASE_URL}/apartments/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to delete apartment: ${res.status}`);
    }

    revalidatePath("/apartments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting apartment:", error);
    throw error;
  }
}
