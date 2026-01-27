"use server";

import { IBuildings } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.120:8000';



// Auth 
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

// get
export async function getBuildings(): Promise<IBuildings[]> {
  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${BASE_URL}/buildings`, {
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

// GET building by ID
export async function getBuildingById(id: string | number): Promise<IBuildings | null> {
  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${BASE_URL}/buildings/${id}`, {
      headers,
      cache: 'no-store',
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to fetch building: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching building:', error);
    return null;
  }
}

// GET buildings by complex ID
export async function getBuildingsByComplexId(complexId: string | number): Promise<IBuildings[]> {
  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${BASE_URL}/buildings?complex_id=${complexId}`, {
      headers,
      cache: 'no-store',
    });
    
    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to fetch buildings by complex: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching buildings by complex:', error);
    return [];
  }
}

// POST create building
export async function createBuilding(data: Partial<IBuildings>): Promise<IBuildings> {
  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${BASE_URL}/buildings/add`, {
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

// PUT update building
export async function updateBuilding(
  id: string | number,
  data: Partial<IBuildings>
) {
  // Auth headers
  const headers = await getAuthHeaders(); 
  headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}/buildings/${id}/`, { 
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update building: ${text}`);
  }

  return res.json();
}


// DELETE building
export async function deleteBuilding(id: number): Promise<{ success: boolean }> {
  try {
    const headers = await getAuthHeaders();
    
    const res = await fetch(`${BASE_URL}/buildings/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!res.ok) {
      if (res.status === 401) redirect("/login");
      throw new Error(`Failed to delete building: ${res.status}`);
    }
    
    revalidatePath('/buildings');
    return { success: true };
  } catch (error) {
    console.error('Error deleting building:', error);
    throw error;
  }
}

