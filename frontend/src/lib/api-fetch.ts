"use server";

import { ENV } from "@/configs/env.config";
import { redirect } from "next/navigation";
import { getAuthData } from "./auth.util";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const authData = await getAuthData();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(authData?.access ? { Authorization: `Bearer ${authData.access}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${ENV.BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = 
      error.detail?.[0]?.msg || 
      error.detail || 
      error.message ||
      `API Error: ${response.status}`;
      
    throw new Error(errorMessage);
  }

  return response.json();
}