"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuildingById } from "@/hooks/useBuildings";
import { useComplexes } from "@/hooks/useComplex";
import { useParams } from "next/dist/client/components/navigation";
import { useState } from "react";
import { ModalUpdateBuildings } from "../modals/building-modals/modal-update-buildings";
import { ModalDeleteBuildings } from "../modals/building-modals/modal-delete-buildings";
import { ModalAddedCoefficient } from "../modals/building-modals/modal-add-coefficient";
import { FaRegBuilding } from "react-icons/fa";
import { MdOutlineBarChart } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { Spinner } from "@/components/ui/spinner";

export function TabsDemo() {
  const [coefficientModalOpen, setCoefficientModalOpen] = useState(false);
  const params = useParams();
  const { id } = params;

  const {
    data: building,
    isLoading: buildingLoading,
    refetch: refetchBuilding,
  } = useBuildingById(id as string);

  const { data: complexes = [], isLoading: complexLoading } = useComplexes();

  const isLoading = buildingLoading || complexLoading;

  const handleCloseModal = () => {
    setCoefficientModalOpen(false);
  };

  const handleSuccess = () => {
    refetchBuilding();
  };

  const buildingComplex = building
    ? complexes.find((c) => c.id === building.complex_id)
    : null;


  if (isLoading || !building) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner />
      </div>
    );
  }
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
        <div className="overflow-hidden rounded-sm bg-gradient-to-br from-indigo-200 via-indigo-100 to-indigo-100 border border-indigo-100 shadow-[0_8px_32px_rgba(99,102,241,0.08)] hover:shadow-[0_16px_48px_rgba(99,102,241,0.12)] transition-all duration-500 hover:-translate-y-1 group">
          <div className="py-6 px-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 ">
              <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-sm font-bold text-indigo-700 flex gap-2 items-center px-3 py-1 shadow-sm">
                <h1 className="text-md ">
                  {building.name
                    ? building.name.charAt(0).toUpperCase() +
                      building.name.slice(1)
                    : "—"}
                </h1>
                <span className="text-xs text-gray-500">Здание</span>
              </div>

              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-xl shadow-sm">
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
                    {building.floor_count}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-300 to-purple-400 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((building.floor_count / 50) * 100, 100)}%`,
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
                    {building.max_coefficient}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-300 to-purple-400 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min((Number(building.max_coefficient) - 1) * 100, 100)}%`,
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
                      {building.price_unit}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {typeof building.base_price === "number"
                      ? building.base_price.toLocaleString()
                      : building.base_price}
                  </div>
                </div>
              </div>
              <div className="h-2 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-300 to-purple-400 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((building.base_price / 10000000) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ModalUpdateBuildings
                //   building={building}
                //   onSuccess={handleSuccess}
                />

                <ModalDeleteBuildings
                  buildingId={building.id}
                  onSuccess={handleSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="Конфигурация коэффициентов">
        <ModalAddedCoefficient
          isOpen={coefficientModalOpen}
          onClose={handleCloseModal}
          buildingId={id as string}
        />
      </TabsContent>
    </Tabs>
  );
}
