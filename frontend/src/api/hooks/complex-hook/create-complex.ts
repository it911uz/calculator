"use client";

import { createComplex } from "@/api/complex/create-complex.api";
import { QueryKeys } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      console.error(error.message || "Failed to create complex");
    },
  });
}