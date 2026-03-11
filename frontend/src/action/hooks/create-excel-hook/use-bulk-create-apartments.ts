"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bulkCreateApartments } from "@/action/create-excel/bulk-create-apartments.api";
import { QueryKeys } from "@/lib/query-keys";

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
      if (res.data) {
        toast.success("Квартиры успешно импортированы");
        queryClient.invalidateQueries({ queryKey: QueryKeys.apartments.all });
      } 
      else if (res._meta?.error) {
        toast.error(res._meta.error, {
          duration: 5000, 
        });
      }
    },
    
    onError: (error: Error) => {
      toast.error(error.message || "Не удалось загрузить файл");
    }
  });
}