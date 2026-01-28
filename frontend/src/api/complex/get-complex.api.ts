"use server";

import { apiFetch } from "@/lib/api-fetch";
import { IComplex } from "@/types";

export async function getComplexById(id: string | number): Promise<IComplex> {
  return apiFetch(`/complexes/${id}`);
}