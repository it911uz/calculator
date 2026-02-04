"use client";

import { useMutation } from "@tanstack/react-query";
import type { CalculatePricingPayload } from "@/types";
import { toast } from "sonner";
import { calculateApartmentPricing } from "@/action/calculator/create-calculator.api";
interface CalculateArgs {
  apartmentId: number | string;
  payload: CalculatePricingPayload;
  params?: Record<string, number>; 
}

export function useCalculatePricing() {
  return useMutation({
    mutationFn: async ({ apartmentId, payload, params }: CalculateArgs) => {
      const res = await calculateApartmentPricing(apartmentId, payload, params || {});
      const meta = res as { _meta?: { error?: string } };
      
      if (meta._meta?.error) {
        throw new Error(meta._meta.error);
      }

      if (!res.data) {
        throw new Error("Не удалось получить данные расчета");
      }

      return res.data;
    },

    onSuccess: () => {
      toast.success("Расчет успешно завершен");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Произошла ошибка при расчете");
    },
  });
}