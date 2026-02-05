import { CalculatorClientPage } from "@/components/shared/calculator-client/_calculator-client";
import { getAuthData } from "@/lib/auth.util";
import { redirect } from "next/navigation";


export default async function CalculatorPage() {
 const { access } = await getAuthData();
 if(!access){
  redirect("/login")
 }
  return (
      <CalculatorClientPage  />
  );
}