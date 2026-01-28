"use client";

import { createComplex } from "@/api/complex/create-complex.api";
import { QueryKeys } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateComplex() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComplex,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.complex.all });
      queryClient.setQueryData(
        QueryKeys.complex.detail(data.id),
        data
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Не удалось создать комплекс");
    },
  });
}