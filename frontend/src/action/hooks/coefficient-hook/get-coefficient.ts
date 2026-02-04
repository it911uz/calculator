"use client";

import { getCoefficientById } from "@/action/coefficient/get-coefficient.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

export function useCoefficient(
  id: number | string | undefined,
  params: Record<string, unknown> = {}
) {
  const query = useQuery({
    queryKey: [...(QueryKeys.coefficients.detail(id as number) || ["coefficients", "detail", id]), params],
    queryFn: () => getCoefficientById(id!, params),
    enabled: !!id,
  });
  useEffect(() => {
    if (query.data?._meta?.error) {
      toast.error(query.data._meta.error);
    }
  }, [query.data?._meta?.error]);

  return query;
}