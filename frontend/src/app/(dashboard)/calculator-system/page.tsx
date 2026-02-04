import { CalculatorClientPage } from "@/components/shared/calculator-client/_calculator-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function CalculatorPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");


  return (
      <CalculatorClientPage  />
  );
}