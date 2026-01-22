
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getBuildingsByComplexId,
  searchBuildings,
} from "@/action/buildings.action";
import { IBuildings, QueryKeys } from "@/types";
import { toast } from "sonner";

// GET all buildings
export function useBuildings() {
  return useQuery({
    queryKey: QueryKeys.buildings.lists(),
    queryFn: getBuildings,
  });
}

// GET building by ID
export function useBuildingById(id: string | number | undefined) {
  return useQuery({
    queryKey: QueryKeys.buildings.detail(id as number | string),
    queryFn: () => getBuildingById(id!),
    enabled: !!id,
  });
}

// GET buildings by complex ID
export function useBuildingsByComplex(complexId: string | number | undefined) {
  return useQuery({
    queryKey: [...QueryKeys.buildings.all, "complex", complexId],
    queryFn: () => getBuildingsByComplexId(complexId!),
    enabled: !!complexId,
  });
}

// SEARCH buildings
export function useSearchBuildings(query: string) {
  return useQuery({
    queryKey: [...QueryKeys.buildings.all, "search", query],
    queryFn: () => searchBuildings(query),
    enabled: query.length > 0,
    staleTime: 0,
  });
}

// CREATE building
export function useCreateBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBuilding,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.all });
      if (data.complex_id) {
        queryClient.invalidateQueries({
          queryKey: [...QueryKeys.buildings.all, "complex", data.complex_id],
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create building");
    },
  });
}

// UPDATE building
export function useUpdateBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<IBuildings> }) =>
      updateBuilding(id, data),
    onSuccess: (data, variables) => {
      toast.success("Building updated successfully");
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.all });
      queryClient.setQueryData(
        QueryKeys.buildings.detail(variables.id),
        data
      );
      if (data.complex_id) {
        queryClient.invalidateQueries({
          queryKey: [...QueryKeys.buildings.all, "complex", data.complex_id],
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update building");
    },
  });
}

// DELETE building
export function useDeleteBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBuilding,
    onSuccess: (_, id) => {
      toast.success("Building deleted successfully");
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.all });
      queryClient.removeQueries({ queryKey: QueryKeys.buildings.detail(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete building");
    },
  });
}