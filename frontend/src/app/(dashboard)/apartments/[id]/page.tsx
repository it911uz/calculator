"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { SpinnerDemo } from "@/components/shared/ui-demo/spinner-demo";
import { ImFileEmpty } from "react-icons/im";
import { ModalUpdateBuildings } from "@/components/shared/ui-demo/modals/building-modals/modal-update-buildings";
import { useApartmentsStore } from "@/modules/apartments/apartments.store";
import { ModalDeleteApartments } from "@/components/shared/ui-demo/modals/apartments-modals/modal-delete-apartments";

export default function SingleApartmentsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { currentApartments, fetchByIdApartments, loading} = useApartmentsStore();

  useEffect(() => {
    if (id) fetchByIdApartments(id as string);
   console.log(id);
   
  }, [id, fetchByIdApartments]);

 if (loading) {
    return (
      <div className="p-6">
        <SpinnerDemo />
      </div>
    );
  }
  
  if (!currentApartments) {
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
            {currentApartments.number}
          </h1>
          <div className="px-3 py-1 bg-gradient-to-br from-indigo-100 to-indigo-50 text-sm font-bold rounded-sm">
            ID: {currentApartments.id}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-sm">
            <div className="text-xs text-gray-500 mb-1">Этажи</div>
            <div className="text-2xl font-bold text-gray-800">
              {currentApartments.room_count}
            </div>
          </div>

          <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-sm">
            <div className="text-xs text-gray-500 mb-1">Цена</div>
            <div className="text-xl font-bold text-gray-800">
              {currentApartments.final_price}
            </div>
            <div className="text-xs text-gray-400">
              {currentApartments.area}
            </div>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-sm">
          <div className="text-xs text-gray-500 mb-1">
            Максимальный коэффициент
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {currentApartments.floor}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-full h-1 bg-gradient-to-r from-indigo-900 via-gray-500 to-gray-200  rounded-full"></div>
        </div>
       <div className="flex justify-between py-4">
        <span></span>
         <div className="flex items-center gap-2.5">
          <ModalUpdateBuildings/>
          <ModalDeleteApartments buildingId={currentApartments.id}/>
        </div>
       </div>
      </div>
    </div>
  );
}
