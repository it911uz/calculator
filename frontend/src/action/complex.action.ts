"use server";

import { IComplex } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.120:8000";



// Token olish va validation
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

// Umumiy fetch funksiyasi
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail?.[0]?.msg || 
      error.detail || 
      `API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// GET all complexes
export async function getComplexes(): Promise<IComplex[]> {
  return apiFetch("/complexes");
}

export async function getComplexById(id: string | number): Promise<IComplex> {
  return apiFetch(`/complexes/${id}`);
}

export async function createComplex(data: Partial<IComplex>): Promise<IComplex> {
  return apiFetch("/complexes/add", { method: "POST", body: JSON.stringify(data) });
}

export async function updateComplex(id: number, data: Partial<IComplex>): Promise<IComplex> {
  return apiFetch(`/complexes/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteComplex(id: number): Promise<void> {
  await apiFetch(`/complexes/${id}`, { method: "DELETE" });
}
