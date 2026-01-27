"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCoefficients,
  getCoefficientById,
  createCoefficient,
  updateCoefficient,
  deleteCoefficient,
} from "@/action/coefficients.action";
import { CreateCoefficientPayload, QueryKeys } from "@/types";
import { ICoefficient } from "@/types";
// GET all coefficients
export function useCoefficients() {
  return useQuery({
    queryKey: QueryKeys.coefficients.lists(),
    queryFn: getCoefficients,
  });
}
// get
export function useCoefficient(id: number) {
  return useQuery({
    queryKey: QueryKeys.coefficients.detail(id),
    queryFn: () => getCoefficientById(id),
    enabled: !!id,
  });
}
// post
export function useCreateCoefficient() {
  const queryClient = useQueryClient();
  return useMutation<ICoefficient, Error, CreateCoefficientPayload>({
    mutationFn: createCoefficient,
    onSuccess: (newCoefficient) => {
      queryClient.invalidateQueries({ queryKey: ["coefficients"] });
      queryClient.invalidateQueries({ 
        queryKey: ["coefficients", "building", newCoefficient.building_id] 
      });
      queryClient.invalidateQueries({
        queryKey: ["coefficient-types", newCoefficient.building_id]
      });
    },
  });
}
// patch
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
//delete
export function useDeleteCoefficient(buildingId: number) { 
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCoefficient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.coefficients.all });
      queryClient.invalidateQueries({
        queryKey: ["coefficient-types", buildingId]
      });
      queryClient.invalidateQueries({ 
        queryKey: ["coefficients", "building", buildingId] 
      });
    },
  });
}