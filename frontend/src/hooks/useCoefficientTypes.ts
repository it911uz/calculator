"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCoefficientTypes,
  getCoefficientTypesByBuildingId,
  createCoefficientType,
  updateCoefficientType,
  deleteCoefficientType,
} from "@/action/coefficients-type.action";
import { QueryKeys } from "@/types";
import { ICoefficientType } from "@/types";

// GET all coefficient types
export function useCoefficientTypes() {
  return useQuery({
    queryKey: QueryKeys.coefficientTypes.lists(),
    queryFn: getCoefficientTypes,
  });
}

// GET coefficient types by building ID
export function useCoefficientTypesByBuildingId(buildingId: number) {
  return useQuery({
    queryKey: ["coefficient-types", buildingId],
    queryFn: () => getCoefficientTypesByBuildingId(buildingId),
    enabled: !!buildingId,
  });
}

// CREATE coefficient type
export function useCreateCoefficientType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCoefficientType,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["coefficient-types", variables.building_id],
        (old: any[] | undefined) => {
          if (!old) return old;

          return old.map((group) => {
            if (group.id === variables.coefficient_id) {
              return {
                ...group,
                bcts: [...group.bcts, data],
              };
            }
            return group;
          });
        },
      );
    },
  });
}

// UPDATE coefficient type
export function useUpdateCoefficientType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<ICoefficientType>;
    }) => updateCoefficientType(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.coefficientTypes.all,
      });
      queryClient.invalidateQueries({
        queryKey: ["coefficient-types", data.building_id],
      });
    },
  });
}

// DELETE coefficient type
export function useDeleteCoefficientType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCoefficientType,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.coefficientTypes.all,
      });
    },
  });
}
