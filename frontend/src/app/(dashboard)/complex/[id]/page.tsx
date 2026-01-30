import { IoIosArrowBack } from "react-icons/io";
import { ImFileEmpty } from "react-icons/im";
import { ModalDeleteComplex } from "@/components/shared/ui-demo/modals/complex-modal/modal-delete-complex";
import { LuText } from "react-icons/lu";
import Link from "next/link";
import ModalUpdateComplex from "@/components/shared/ui-demo/modals/complex-modal/modal-update-complex";
import { getComplexById } from "@/action/complex/get-complex.api";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SingleComplexPage({ params }: Props) {
  const { id } = await params;
  const currentComplexSafe = await getComplexById(id);

  const currentComplex = currentComplexSafe.data;

  if (!currentComplex) {
    return (
      <div className="flex items-center justify-center flex-col h-screen">
        <p className="text-center font-bold text-gray-500">
          Информация не найдена
        </p>
        <ImFileEmpty size={40} className="text-gray-300 mt-2" />
        <Link href="/complex" className="mt-4 text-indigo-600 underline">
          Вернуться назад
        </Link>
      </div>
    );
  }

  return (
    <div className="">
      <Link href={"/complex"}>
        <button className="text-gray-200 hover:text-white bg-[#282964] px-3 py-1 rounded-[3px] mb-6 transition-colors">
          <IoIosArrowBack />
        </button>
      </Link>

      <div className="overflow-hidden rounded-sm bg-gradient-to-br from-indigo-200 via-indigo-100 to-indigo-100 border border-indigo-100 shadow-md transition-all duration-500 group">
        <div className="py-6 px-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-sm font-bold text-indigo-700 flex gap-2 items-center px-3 py-1 shadow-sm">
              <h1 className="text-md capitalize">{currentComplex.name || "—"}</h1>
              <span className="text-xs text-gray-400 font-normal">Здание</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <LuText className="text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">Описание</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {currentComplex.description ? (
                <span className="capitalize">{currentComplex.description}</span>
              ) : (
                <span className="flex gap-2 items-center text-gray-400 text-sm">
                  <ImFileEmpty /> Описание отсутствует
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2.5 items-center pt-2">
            <ModalDeleteComplex buildingId={currentComplex.id} />
            <ModalUpdateComplex complex={currentComplex} />
          </div>
        </div>
      </div>
    </div>
  );
}
