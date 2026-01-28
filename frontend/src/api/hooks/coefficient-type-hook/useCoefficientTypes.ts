"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCoefficientTypes,
  getCoefficientTypesByBuildingId,
  createCoefficientType,
  updateCoefficientType,
  deleteCoefficientType,
} from "@/api/actions/coefficients-type-action/coefficients-type.action";
import { CreateCoefficientTypePayload, ICoefficientTypeGroup, QueryKeys } from "@/types";
import { ICoefficientType } from "@/types";
import { toast } from 'sonner';

export function useCoefficientTypes() {
  return useQuery({
    queryKey: QueryKeys.coefficientTypes?.lists() || ["coefficientTypes", "list"],
    queryFn: getCoefficientTypes,
  });
}
// get
export function useCoefficientTypesByBuildingId(buildingId: number) {
  return useQuery({
    queryKey: ["coefficient-types", buildingId],
    queryFn: () => getCoefficientTypesByBuildingId(buildingId),
    enabled: !!buildingId,
  });
}

// CREATE 
export function useCreateCoefficientType() {
  const queryClient = useQueryClient();

  return useMutation<
    ICoefficientType,                  
    Error,
    CreateCoefficientTypePayload      
  >({
    mutationFn: createCoefficientType,

    onSuccess: (data, variables) => {
      queryClient.setQueryData<ICoefficientTypeGroup[]>(
        ["coefficient-types", variables.building_id],
        (old) => {
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
        }
      );
    },
  });
}


// update
export function useUpdateCoefficientType(buildingId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      coefficientTypeId,
      name,
      rate,
      coefficient_id, 
    }: {
      coefficientTypeId: number;
      name: string;
      rate: string | number;
      coefficient_id: number;
    }) =>
      updateCoefficientType(coefficientTypeId, {
        name,
        rate,
        coefficient_id,
      }),

    onSuccess: (data, variables) => {
      toast.success("Обновлено успешно");
      queryClient.invalidateQueries({
        queryKey: ["coefficient-types", buildingId],
      });
    },

    onError: (error) => {
      console.error("Update coefficient type error:", error);
      toast.error("Не удалось обновить тип коэффициента");
    },
  });
}

//dlete
export function useDeleteCoefficientType(buildingId: number) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error,number>({
    mutationFn: deleteCoefficientType,
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<ICoefficientTypeGroup[]>(
        ["coefficient-types", buildingId],
        (old) => {
          if (!old) return old;

          return old.map((group) => ({
            ...group,
            bcts: group.bcts.filter(
              (item) => item.id !== deletedId
            ),
          }));
        }
      );
    },
  });
}



