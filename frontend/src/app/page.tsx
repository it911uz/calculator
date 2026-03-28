import DashboardLayout from "@/components/layouts/dashboard-layout/_dashboard-layout";
import Complex from "./(dashboard)/complex/page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
	const cookieStore = await cookies();
	const token = cookieStore.get("access_token")?.value;

	if (!token) redirect("/login");

	return (
		<DashboardLayout>
			<Complex />
		</DashboardLayout>
	);
}
