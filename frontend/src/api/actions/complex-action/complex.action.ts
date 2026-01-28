"use server";

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { IComplex } from "@/types";
import { redirect } from "next/navigation";
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${ENV.BASE_URL}${endpoint}`, {
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
//update
export async function updateComplex(
  id: number,
  data: Partial<IComplex>
): Promise<IComplex> {
  const headers = await getAuthHeaders();

  const res = await fetch(`${ENV.BASE_URL}/complexes/${id}/`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Update failed");
  }

  return res.json();
}

//delete
export async function deleteComplex(id: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${ENV.BASE_URL}/complexes/${id}/`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }
}

