"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/types";
import { toast } from "sonner";
import { bulkCreateApartments } from "@/action/create-excel/bulk-create-apartments.api";

interface BulkCreateArgs {
  buildingId: number | string;
  file: File;
}

export function useBulkCreateApartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ buildingId, file }: BulkCreateArgs) => 
      bulkCreateApartments(buildingId, file),
    
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Квартиры успешно импортированы");
        queryClient.invalidateQueries({ queryKey: QueryKeys.apartments.all });
      } else if (res._meta?.error) {
        toast.error(res._meta.error);
      }
    },
    
    onError: (error: Error) => {
      toast.error(error.message || "Не удалось загрузить файл");
    }
  });
}