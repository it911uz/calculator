"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { SpinnerDemo } from "@/components/shared/ui-demo/spinner-demo";
import { ImFileEmpty } from "react-icons/im";
import { ModalUpdateBuildings } from "@/components/shared/ui-demo/modals/building-modals/modal-update-buildings";
import { useComplexStore } from "@/modules/complex/complex.store";
import { ModalDeleteComplex } from "@/components/shared/ui-demo/modals/complex-modal/modal-delete-complex";

export default function SingleComplexPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const {
    currentComplex,
    loading,

    fetchByIDComplex,
  } = useComplexStore();

  useEffect(() => {
    if (id) {
      fetchByIDComplex(id as string);
    }
  }, [id, fetchByIDComplex]);

  if (loading) {
    return (
      <div className="p-6">
        <SpinnerDemo />
      </div>
    );
  }

  if (!currentComplex) {
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
          <h1 className="text-2xl font-bold text-gray-900">
            {currentComplex.name}
          </h1>
          <div className="px-3 py-1 bg-gradient-to-br from-blue-50 to-white text-sm font-bold rounded-sm">
            ID: {currentComplex.id}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-sm">
            <div className="text-xs text-gray-500 mb-1">Этажи</div>
            <div className="text-lg font-bold text-gray-800">
              {currentComplex.name}
            </div>
          </div>

          <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-sm">
            <div className="text-xs text-gray-500 mb-1">
            Максимальный коэффициент
          </div>
          <div className="text-lg font-bold text-gray-900">
            {currentComplex.description}
          </div>
          </div>
        </div>

        

        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-full h-1 bg-gradient-to-r from-indigo-900 via-gray-500 to-gray-200  rounded-full"></div>
        </div>
       <div className="flex justify-between py-4">
        <span></span>
         <div className="flex items-center gap-2.5">
          <ModalUpdateBuildings/>
          <ModalDeleteComplex buildingId={currentComplex.id}/>
        </div>
       </div>
      </div>
    </div>
  );
}
