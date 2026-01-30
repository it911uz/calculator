"use client";

import { updateComplex } from "@/action/complex/update-complex.api";
import type { IComplex } from "@/types"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateComplexArgs {
  id: number;
  data: { name: string; description?: string };
}

export function useUpdateComplex() {
  const queryClient = useQueryClient();
  return useMutation<IComplex, Error, UpdateComplexArgs>({
    mutationFn: async ({ id, data }) => {
      const res = await updateComplex(id, data);
      if (res._meta?.error) {
        throw new Error(res._meta.error);
      }
      if (!res.data) {
        throw new Error("Ma'lumot yangilanmadi");
      }
      return res.data;
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["complex", data.id], data);
      
      queryClient.invalidateQueries({
        queryKey: ["complex"],
      });

      toast.success("Комплекс обновлен");
    },

    onError: (error) => {
      toast.error(error.message || "Ошибка при обновлении");
    },
  });
}