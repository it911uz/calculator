"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBuildingsStore } from "@/modules/buildings/buildings.store";
import { IoIosArrowBack } from "react-icons/io";
import { SpinnerDemo } from "@/components/shared/ui-demo/spinner-demo";
import { ImFileEmpty } from "react-icons/im";
import { ModalUpdateBuildings } from "@/components/shared/ui-demo/modals/building-modals/modal-update-buildings";
import { ModalDeleteBuildings } from "@/components/shared/ui-demo/modals/building-modals/modal-delete-buildings";
import { useComplexStore } from "@/modules/complex/complex.store";
import { ModalAddedCoefficient } from "@/components/shared/ui-demo/modals/building-modals/modal-add-coefficient";

export default function SingleBuildingPage() {
  const [coefficientModalOpen, setCoefficientModalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const {
    currentBuildings,
    loading,

    fetchByIDBUildings,
  } = useBuildingsStore();

  const { fetchAllComplex, complex } = useComplexStore();

  const buildingComplex = useMemo(() => {
    if (!currentBuildings) return null;
    return complex.find((c) => c.id === currentBuildings.complex_id);
  }, [complex, currentBuildings]);

  useEffect(() => {
    if (id) {
      fetchByIDBUildings(id as string);
      fetchAllComplex();
    }
  }, [id, fetchByIDBUildings, fetchAllComplex]);

   const handleCloseModal = () => {
    setCoefficientModalOpen(false);
  };
  if (loading) {
    return (
      <div className="p-6">
        <SpinnerDemo />
      </div>
    );
  }

  if (!currentBuildings) {
    return (
      <div className="flex items-center justify-center flex-col h-screen ">
        <p className="text-center">Информация не найдена</p>
        <ImFileEmpty size={30} />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className=" text-gray-200 hover:text-white bg-[#282964] px-3 py-1 rounded-[3px] mb-6"
      >
        <IoIosArrowBack />
      </button>

      <div
        className="p-5 rounded-[3px]py-4 px-2 rounded-[3px] shadow-[0_4px_16px_rgba(215,215,248,0.8)] bg-white
                transform hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-xl font-bold text-indigo-900">
            Имя: {currentBuildings.name}
          </h1>
          <div className="px-3 py-1 bg-gradient-to-br from-indigo-100 to-white text-sm font-bold rounded-sm">
            В комплексе:{" "}
            <span className="px-4">{buildingComplex?.name ?? "—"}</span>
            {/* {currentBuildings.complex_id} */}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-sm">
            <div className="text-xs text-gray-500 mb-1">Этажи</div>
            <div className="text-2xl font-bold text-gray-800">
              {currentBuildings.floor_count}
            </div>
          </div>

          <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-sm">
            <div className="text-xs text-gray-500 mb-1">
              Максимальный коэффициент
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {currentBuildings.max_coefficient}
            </div>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-sm">
          <div className="text-xs text-gray-500 mb-1">Цена</div>
          <div className="text-xl font-bold text-gray-800">
            {currentBuildings.base_price}
          </div>
          <div className="text-xs text-gray-400">
            {currentBuildings.price_unit}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-full h-1 bg-gradient-to-r from-indigo-900 via-gray-500 to-gray-200  rounded-full"></div>
        </div>
        <div className="flex justify-between py-4">
          <div className="flex items-center gap-2.5">
            <ModalUpdateBuildings />
            <ModalDeleteBuildings buildingId={currentBuildings.id} />
          </div>
          <button
            onClick={() => setCoefficientModalOpen(true)}
            className="bg-[#282964] text-white px-3 py-1 rounded-[3px] hover:bg-indigo-900 transition-colors flex items-center gap-2"
          >
            <span>Конфигурация коэффициентов</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        <div>
          <ModalAddedCoefficient 
          isOpen={coefficientModalOpen} 
          onClose={handleCloseModal} 
        />
        </div>
      </div>
    </div>
  );
}
