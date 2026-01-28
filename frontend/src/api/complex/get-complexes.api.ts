import { apiFetch } from "@/lib/api-fetch";
import type { IComplex } from "@/types";

export async function getComplexes(): Promise<IComplex[]> {
  return apiFetch("/complexes");
}