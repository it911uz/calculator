"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCoefficients,
  getCoefficientById,
  createCoefficient,
  updateCoefficient,
  deleteCoefficient,
} from "@/action/coefficients.action";
import { QueryKeys } from "@/types";
import { ICoefficient } from "@/types";

// GET all coefficients
export function useCoefficients() {
  return useQuery({
    queryKey: QueryKeys.coefficients.lists(),
    queryFn: getCoefficients,
  });
}

// GET coefficient by ID
export function useCoefficient(id: number) {
  return useQuery({
    queryKey: QueryKeys.coefficients.detail(id),
    queryFn: () => getCoefficientById(id),
    enabled: !!id,
  });
}

// CREATE coefficient
export function useCreateCoefficient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCoefficient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.coefficients.all });
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.detail(data.building_id) });
    },
  });
}

// UPDATE coefficient
export function useUpdateCoefficient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ICoefficient> }) =>
      updateCoefficient(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.coefficients.all });
      queryClient.invalidateQueries({ queryKey: QueryKeys.coefficients.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.detail(data.building_id) });
    },
  });
}

// DELETE coefficient
export function useDeleteCoefficient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCoefficient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.coefficients.all });
    },
  });
}
