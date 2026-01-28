"use client";

import { updateComplex } from "@/api/complex/update-complex.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateComplex() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name: string; description?: string };
    }) => updateComplex(id, data),

    onSuccess: (updatedComplex) => {
      queryClient.setQueryData(
        ["complex", updatedComplex.id],
        updatedComplex
      );
      queryClient.invalidateQueries({
        queryKey: ["complex"],
      });
    },
  });
}