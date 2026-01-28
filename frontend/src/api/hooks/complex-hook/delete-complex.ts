"use client";

import { deleteComplex } from "@/api/complex/delete-complex.api";
import { IComplex, QueryKeys } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteComplex() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComplex,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.complex.all });
      const id = typeof variables === 'number' ? variables : undefined;
      if (id) {
        queryClient.removeQueries({ queryKey: QueryKeys.complex.detail(id) });
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QueryKeys.complex.all });
      
      const previousComplexes = queryClient.getQueryData<IComplex[]>(
        QueryKeys.complex.lists()
      );
      const newComplexes = previousComplexes?.filter((complex) => complex.id !== id) || [];
      queryClient.setQueryData<IComplex[]>(
        QueryKeys.complex.lists(),
        newComplexes
      );
      return { previousComplexes };
    },
    onError: (error, id, context) => {
      if (context?.previousComplexes) {
        queryClient.setQueryData(
          QueryKeys.complex.lists(),
          context.previousComplexes
        );
      }
      toast.error(error.message || "Ошибка");
    },
  });
}