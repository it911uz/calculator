"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { SpinnerDemo } from "@/components/shared/ui-demo/spinner-demo";
import { ImFileEmpty } from "react-icons/im";
import { useBuildingById } from "@/hooks/useBuildings";
import { useComplexes } from "@/hooks/useComplex";
import { TabsDemo } from "@/components/shared/ui-demo/tabs";

export default function SingleBuildingPage() {
  const [coefficientModalOpen, setCoefficientModalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  // TanStack Query
  const {
    data: building,
    isLoading: buildingLoading,
    error: buildingError,
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

  if (isLoading) {
    return (
      <div className="p-6">
        <SpinnerDemo />
      </div>
    );
  }

  if (buildingError || !building) {
    return (
      <div className="flex items-center justify-center flex-col h-screen">
        <p className="text-center">Информация не найдена</p>
        <ImFileEmpty size={30} />
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="text-gray-200 hover:text-white bg-[#282964] px-3 py-1 rounded-[3px] mb-6"
      >
        <IoIosArrowBack />
      </button>

      <TabsDemo />

      
    </div>
  );
}
