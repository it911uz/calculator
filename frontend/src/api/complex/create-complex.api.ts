import type { IComplex } from "@/types";
import { apiFetch } from "@/lib/api-fetch"; 
export async function createComplex(data: Partial<IComplex>): Promise<IComplex> {
  return apiFetch("/complexes/add/", { 
    method: "POST", 
    body: JSON.stringify(data) 
  });
}
