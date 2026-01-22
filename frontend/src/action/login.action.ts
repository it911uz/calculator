"use server";

import { cookies } from "next/headers";

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
}

export async function loginAction(formData: FormData): Promise<boolean> {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://192.168.1.120:8000";

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!username || !password) {
    throw new Error("Пожалуйста, заполните все обязательные поля");
  }

  const body = new URLSearchParams({
    grant_type: "password",
    username,
    password,
  });

  const res = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as {
      detail?: string;
      error?: string;
    } | null;

    throw new Error(err?.detail ?? err?.error ?? "Ошибка авторизации");
  }

  const data = (await res.json()) as LoginResponse;

  if (!data.access_token) {
    throw new Error("Токен не получен");
  }

  const cookieStore = await cookies();

  cookieStore.set("access_token", data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  if (data.refresh_token) {
    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return true; 
}
