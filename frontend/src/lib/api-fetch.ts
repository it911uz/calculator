"use server";

import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "./utils";
import { redirect } from "next/navigation";

export async function apiFetch<T>(
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