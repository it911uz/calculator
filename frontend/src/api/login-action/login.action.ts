"use server";

import { ENV } from "@/configs/env.config";
import { LoginResponse } from "@/types";
import { cookies } from "next/headers";



export async function loginAction(formData: FormData): Promise<boolean> {
 

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

  const res = await fetch(`${ENV.BASE_URL}/auth/token`, {
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
