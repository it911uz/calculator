"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getComplexes,
  getComplexById,
  createComplex,
  updateComplex,
  deleteComplex,
} from "@/api/actions/complex-action/complex.action";
import { QueryKeys } from "@/types";
import { IComplex } from "@/types";

//all
export function useComplexes() {
  return useQuery({
    queryKey: QueryKeys.complex.lists(),
    queryFn: getComplexes,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, 
  });
}
//by id
export function useComplexById(id?: string | number) {
  return useQuery<IComplex>({
    queryKey: ["complex", id],
    queryFn: () => getComplexById(id as string),
    enabled: !!id, 
  });
}
//create complex
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
//update
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


//
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
      console.error(error.message || "Ошибка");
    },
  });
}