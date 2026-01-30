"use client"

import { updateApartment } from "@/action/apartaments/update-apartment.api";
import type { IApartment, UpdateArgs } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export function useUpdateApartment() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<IApartment, Error, UpdateArgs>({
    mutationFn: async ({ id, data }) => {
      const res = await updateApartment(id, data);
      if (res._meta?.error) {
        throw new Error(res._meta.error);
      }
      if (!res.data) {
        throw new Error("Ma'lumot topilmadi");
      }

      return res.data;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      queryClient.setQueryData(["apartments", "detail", String(variables.id)], data);
      if (data.building_id) {
        queryClient.invalidateQueries({ 
          queryKey: ["buildings", "detail", data.building_id] 
        });
      }

      toast.success("Квартира успешно обновлена");
      router.refresh(); 
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось обновить квартиру");
    },
  });
}