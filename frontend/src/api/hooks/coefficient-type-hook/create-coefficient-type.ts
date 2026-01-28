"use client";

import { createCoefficientType } from "@/api/coefficient-types/create-coefficient.api";
import { CreateCoefficientTypePayload, ICoefficientType, ICoefficientTypeGroup } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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