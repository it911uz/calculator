import { IoIosArrowBack } from "react-icons/io";
import { ImFileEmpty } from "react-icons/im";
import { TabsDemoBuildings } from "@/components/shared/ui-demo/tabs/_tab-buildings";
import Link from "next/link";
import { getBuildingById } from "@/action/buildings/get-building.api";
import { getComplexes } from "@/action/complex/get-complexes.api";
import type { IComplex } from "@/types/complex.types";
import { getAuthData } from "@/lib/auth.util";
import { redirect } from "next/navigation";
import type { Props } from "@/types/props.types";

export default async function SingleBuildingPage({ params }: Props) {
	const { access } = await getAuthData();

	if (!access) {
		redirect("/login");
	}
	const { id } = await params;
	if (!id) {
		redirect("/buildings");
	}
	const [buildingSafe, complexes] = await Promise.all([
		getBuildingById(id),
		getComplexes(),
	]);

	const building = buildingSafe.data;

	if (!building) {
		return (
			<div className="flex items-center justify-center flex-col h-screen text-gray-500">
				<ImFileEmpty size={40} className="mb-2 text-gray-300" />
				<p className="text-center font-medium font-sans">
					Информация не найдена
				</p>
				<Link
					href="/buildings"
					className="mt-4 px-6 py-2 bg-[#282964] text-white rounded-[3px] text-sm"
				>
					Назад к списку
				</Link>
			</div>
		);
	}

	return (
		<div>
			<Link href="/buildings">
				<button className="text-gray-200 hover:text-white bg-[#282964] px-3 py-1.5 rounded-[3px] transition-all active:scale-95 shadow-sm mb-4">
					<IoIosArrowBack size={18} />
				</button>
			</Link>

			<TabsDemoBuildings
				initialBuilding={building}
				allComplexes={complexes as IComplex[]}
			/>
		</div>
	);
}
