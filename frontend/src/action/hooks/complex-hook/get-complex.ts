"use client";

import { getComplexById } from "@/action/complex/get-complex.api";
import type { IComplex } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useComplexById(id?: string | number) {
  return useQuery<IComplex, Error>({
    queryKey: ["complex", id],
    queryFn: async () => {
      if (!id) throw new Error("ID topilmadi");

      const res = await getComplexById(id);
      if (res._meta?.error) {
        throw new Error(res._meta.error);
      }
      if (!res.data) {
        throw new Error("Ma'lumot topilmadi");
      }
      return res.data;
    },
    enabled: !!id, 
  });
}