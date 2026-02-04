import { ENV } from "@/configs/env.config";
import { createSearchParams } from "@/lib/api.util";
import { getAuthData } from "@/lib/auth.util";
import type { CalculatePricingPayload, CalculatePricingResponse, SafeObject } from "@/types";

export async function calculateApartmentPricing(
  apartmentId: number | string,
  payload: CalculatePricingPayload,
  params: Record<string, number> = {}
) {
  const result: SafeObject<CalculatePricingResponse> = { data: null };

  const searchParams = createSearchParams(params).toString();

  try {
    const authData = await getAuthData();

    if (!authData?.access) {
      result._meta = {
        status: 401,
        error: "Ошибка авторизации: Токен не найден",
        reason: "TOKEN",
      };
      return result;
    }

    const res = await fetch(`${ENV.BASE_URL}/calculator/${apartmentId}/${searchParams ? `?${searchParams}` : ""}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authData.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = (await res.json().catch(() => ({}))) as { detail?: string };
      result._meta = {
        status: res.status,
        error: errorData.detail || `Ошибка расчета: ${res.status}`,
        reason: "HTTP",
      };
      return result;
    }

    result.data = (await res.json()) as CalculatePricingResponse;
    return result;

  } catch (error: unknown) {
    result._meta = {
      status: 500,
      error: error instanceof Error ? error.message : "Непредвиденная ошибка сервера",
      reason: "UNKNOWN",
    };
    return result;
  }
}