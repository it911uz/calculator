
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getBuildingsByComplexId,
} from "@/action/buildings.action";
import { IBuildings, QueryKeys } from "@/types";
import { toast } from "sonner";
 
// GET 
export function useBuildings() {
  return useQuery({
    queryKey: QueryKeys.buildings.lists(),
    queryFn: getBuildings,
  });
}

// GET 
export function useBuildingById(id: string | number | undefined) {
  return useQuery({
    queryKey: QueryKeys.buildings.detail(id as number | string),
    queryFn: () => getBuildingById(id!),
    enabled: !!id,
  });
}

// GET 
export function useBuildingsByComplex(complexId: string | number | undefined) {
  return useQuery({
    queryKey: [...QueryKeys.buildings.all, "complex", complexId],
    queryFn: () => getBuildingsByComplexId(complexId!),
    enabled: !!complexId,
  });
}



// CREATE
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

// UPDATE 
export function useUpdateBuilding() {
  const queryClient = useQueryClient();

  return useMutation<
    IBuildings, 
    Error,      
    { id: string | number; data: Partial<IBuildings> }
  >({
    mutationFn: ({ id, data }) => updateBuilding(id, data),

    onSuccess: (data, variables) => {
      toast.success("Здание обновлено");
      
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.all });

      queryClient.setQueryData(QueryKeys.buildings.detail(variables.id), data);

      if (data.complex_id) {
        queryClient.invalidateQueries({
          queryKey: [...QueryKeys.buildings.all, "complex", data.complex_id],
        });
      }
    },

    onError: (error) => {
      toast.error(error.message || "Ошибка при обновлении здания");
    },
  });
}



// DELETE building
export function useDeleteBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBuilding,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.all });
      queryClient.removeQueries({ queryKey: QueryKeys.buildings.detail(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete building");
    },
  });
}
