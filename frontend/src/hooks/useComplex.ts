// hooks/useComplex.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getComplexes,
  getComplexById,
  createComplex,
  updateComplex,
  deleteComplex,
} from "@/action/complex.action";
import { QueryKeys } from "@/types";
import { IComplex } from "@/types";
import { toast } from "sonner";

type ComplexMutationData = Partial<IComplex>;

export function useComplexes() {
  return useQuery({
    queryKey: QueryKeys.complex.lists(),
    queryFn: getComplexes,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, 
  });
}

export function useComplex(id: string | number | undefined) {
  return useQuery({
    queryKey: QueryKeys.complex.detail(id as string | number),
    queryFn: () => getComplexById(id!),
    enabled: !!id,
    retry: 1,
  });
}

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
      toast.error(error.message || "Failed to create complex");
    },
  });
}

export function useUpdateComplex() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ComplexMutationData }) =>
      updateComplex(id, data),
    onSuccess: (data, variables) => {
      toast.success("Complex updated successfully");
      queryClient.invalidateQueries({ queryKey: QueryKeys.complex.all });
      queryClient.setQueryData(
        QueryKeys.complex.detail(variables.id),
        data
      );
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: QueryKeys.complex.detail(id) });
      
      const previousComplex = queryClient.getQueryData<IComplex>(
        QueryKeys.complex.detail(id)
      );

      if (previousComplex) {
        queryClient.setQueryData<IComplex>(
          QueryKeys.complex.detail(id),
          { ...previousComplex, ...data }
        );
      }

      return { previousComplex };
    },
    onError: (error, variables, context) => {
      if (context?.previousComplex) {
        queryClient.setQueryData(
          QueryKeys.complex.detail(variables.id),
          context.previousComplex
        );
      }
      toast.error(error.message || "Failed to update complex");
    },
  });
}

export function useDeleteComplex() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComplex,
    onSuccess: (_, variables) => {
      toast.success("Complex deleted successfully");
      queryClient.invalidateQueries({ queryKey: QueryKeys.complex.all });
      
      // Check if variables is a number (id) or an object
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
      toast.error(error.message || "Failed to delete complex");
    },
  });
}