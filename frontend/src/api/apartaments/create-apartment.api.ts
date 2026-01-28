"use server"
import { ENV } from "@/configs/env.config";
import { getAuthHeaders } from "@/lib/utils";
import { FastApiErrorResponse, IApartment } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createApartment(
  data: Partial<IApartment>,
): Promise<IApartment> {
  try {
    const headers = await getAuthHeaders();
    const apiUrl = `${ENV.BASE_URL}/apartments/add`;

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
    console.log("Успешный ответ:", result);

    revalidatePath("/apartments");
    revalidatePath(`/buildings/${data.building_id}`);
    revalidatePath(`/dashboard`);

    return result;
  } catch (error) {
    console.error("Общая ошибка создания квартиры:", error);
    throw error;
  }
}