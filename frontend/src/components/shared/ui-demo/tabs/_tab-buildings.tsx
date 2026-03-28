"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModalUpdateBuildings } from "../modals/building-modals/modal-update-buildings/_modal-update-building";
import { ModalDeleteBuildings } from "../modals/building-modals/modal-delete-buildings/_modal-delete-buildings";
import { ModalAddedCoefficient } from "../modals/building-modals/modal-add-coefficient/_modal-add-coefficient";
import { FaRegBuilding } from "react-icons/fa";
import { MdOutlineBarChart } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { useRouter } from "next/navigation";
import type { TabsProps } from "@/types/props.types";
import Image from "next/image";
import { getImageUrl } from "@/utils/get-imgUrl";

export function TabsDemoBuildings({
	initialBuilding,
	allComplexes,
}: TabsProps) {
	const router = useRouter();

	const handleSuccess = () => {
		router.refresh();
	};

	const buildingComplex = allComplexes.find(
		(c) => c.id === initialBuilding.complex_id,
	);

	return (
		<Tabs defaultValue="Информация о здании" className="w-full">
			<TabsList>
				<TabsTrigger value="Информация о здании">
					Информация о здании
				</TabsTrigger>
				<TabsTrigger value="Конфигурация коэффициентов">
					Конфигурация коэффициентов
				</TabsTrigger>
			</TabsList>

			<TabsContent value="Информация о здании">
				<div className="overflow-hidden rounded-sm bg-linear-to-br from-indigo-200 via-indigo-100 to-indigo-100 border border-indigo-100 shadow-[0_8px_32px_rgba(99,102,241,0.08)] hover:shadow-[0_16px_48px_rgba(99,102,241,0.12)] transition-all duration-500 hover:-translate-y-1 group">
					<div className="py-6 px-3 space-y-4">
						<div className="flex items-start gap-3 justify-start ">
							<div className="relative w-48 h-48 ">
								<Image
									fill
									unoptimized
									src={getImageUrl(initialBuilding.image_url)}
									alt="Изображение здания"
									className="object-cover rounded-lg border border-gray-300 shadow-sm"
								/>
							</div>
							<div className="flex flex-col justify-start gap-4 m ">
								<div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-sm shadow-sm">
									<div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></div>
									<span className="text-sm font-medium text-gray-700">
										В комплексе:
									</span>
									<span className="ml-2 font-bold text-indigo-700">
										{buildingComplex?.name
											? buildingComplex.name.charAt(0).toUpperCase() +
												buildingComplex.name.slice(1)
											: "—"}
									</span>
								</div>
								<div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-sm font-bold text-indigo-700 flex gap-2 items-center px-3 py-1 shadow-sm">
									<h1 className="text-md ">
										{initialBuilding.name
											? initialBuilding.name.charAt(0).toUpperCase() +
												initialBuilding.name.slice(1)
											: "—"}
									</h1>
									<span className="text-xs text-gray-500 font-normal">
										Здание
									</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ">
							<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 p-4 group/card">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center">
										<span className="text-indigo-600">
											<FaRegBuilding />
										</span>
									</div>
									<span className="text-xs font-medium text-gray-500">
										Этажи
									</span>
								</div>
								<div className="flex items-baseline gap-2">
									<span className="text-4xl font-bold text-gray-900">
										{initialBuilding.floor_count}
									</span>
								</div>
								<div className="mt-3 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-indigo-300 to-purple-400 rounded-full transition-all duration-700"
										style={{
											width: `${Math.min((Number(initialBuilding.floor_count) / 50) * 100, 100)}%`,
										}}
									></div>
								</div>
							</div>

							<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 p-4 group/card">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center">
										<span className="text-indigo-600">
											<MdOutlineBarChart />
										</span>
									</div>
									<span className="text-xs font-medium text-gray-500">
										Макс. коэффициент
									</span>
								</div>
								<div className="flex items-baseline gap-2">
									<span className="text-4xl font-bold text-gray-900">
										{initialBuilding.max_coefficient}
									</span>
								</div>
								<div className="mt-3 flex items-center gap-2">
									<div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-indigo-300 to-purple-400 rounded-full transition-all duration-700"
											style={{
												width: `${Math.min((Number(initialBuilding.max_coefficient) - 1) * 100, 100)}%`,
											}}
										></div>
									</div>
								</div>
							</div>
						</div>

						<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 p-5 mb-6">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center shadow-sm">
										<span className="text-indigo-600">
											<GrMoney />
										</span>
									</div>
									<div>
										<span className="text-sm font-medium text-gray-500">
											Базовая цена
										</span>
										<div className="text-xs text-gray-400">
											{initialBuilding.price_unit}
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-3xl font-bold text-gray-900">
										{typeof initialBuilding.base_price === "number"
											? initialBuilding.base_price.toLocaleString("ru-RU")
											: initialBuilding.base_price}{" "}
										<span>
											<span className="text-sm text-purple-500">
												{initialBuilding.price_unit === "UZS" ? "Сум" : "$"}
											</span>
										</span>
									</div>
								</div>
							</div>
							<div className="h-2 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-indigo-300 to-purple-400 rounded-full transition-all duration-1000"
									style={{
										width: `${Math.min((Number(initialBuilding.base_price) / 1000000) * 100, 100)}%`,
									}}
								></div>
							</div>
						</div>

						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<ModalUpdateBuildings
									building={initialBuilding}
									onSuccess={handleSuccess}
								/>

								<ModalDeleteBuildings
									buildingId={initialBuilding.id}
									onSuccess={handleSuccess}
								/>
							</div>
						</div>
					</div>
				</div>
			</TabsContent>

			<TabsContent value="Конфигурация коэффициентов">
				<div>
					<ModalAddedCoefficient buildingId={Number(initialBuilding.id)} />
				</div>
			</TabsContent>
		</Tabs>
	);
}
