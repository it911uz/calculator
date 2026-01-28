"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuthData() {
  const cookieStore = await cookies();
  
  const access = cookieStore.get("access_token")?.value;
  const refresh = cookieStore.get("refresh_token")?.value;
  const userStr = cookieStore.get("user_data")?.value;

  if (!access) {
    redirect("/login");
  }

  return {
    access,
    refresh,
    user: userStr ? JSON.parse(userStr) : null,
  };
}