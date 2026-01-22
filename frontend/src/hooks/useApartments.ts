// hooks/useApartments.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
  getApartmentsByBuildingId,
} from "@/action/apartments.action";
import { IApartment, QueryKeys } from "@/types";
import { toast } from "sonner";

// GET all apartments
export function useApartments() {
  return useQuery({
    queryKey: QueryKeys.apartments?.lists() || ["apartments", "list"],
    queryFn: getApartments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// GET apartment by ID
export function useApartment(id: string | number | undefined) {
  return useQuery({
    queryKey: QueryKeys.apartments?.detail(id as string | number) || ["apartments", "detail", id],
    queryFn: () => getApartmentById(id!),
    enabled: !!id,
  });
}

// GET apartments by building ID
export function useApartmentsByBuilding(buildingId: string | number | undefined) {
  return useQuery({
    queryKey: ["apartments", "building", buildingId],
    queryFn: () => getApartmentsByBuildingId(buildingId!),
    enabled: !!buildingId,
  });
}


// CREATE apartment
export function useCreateApartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApartment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      if (data.building_id) {
        queryClient.invalidateQueries({ queryKey: ["buildings", "detail", data.building_id] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create apartment");
    },
  });
}

// UPDATE apartment
export function useUpdateApartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IApartment> }) =>
      updateApartment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      queryClient.setQueryData(
        ["apartments", "detail", variables.id],
        data
      );
      if (data.building_id) {
        queryClient.invalidateQueries({ queryKey: ["buildings", "detail", data.building_id] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update apartment");
    },
  });
}

// DELETE apartment
export function useDeleteApartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApartment,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      queryClient.removeQueries({ queryKey: ["apartments", "detail", id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete apartment");
    },
  });
}