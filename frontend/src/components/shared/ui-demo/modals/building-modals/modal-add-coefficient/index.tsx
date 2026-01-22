"use client";

import { ImFilesEmpty } from "react-icons/im";
import { MdDeleteOutline, MdOutlineModeEditOutline } from "react-icons/md";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

import {
  useCoefficientTypesByBuildingId,
  useCreateCoefficientType,
  useDeleteCoefficientType,
} from "@/hooks/useCoefficientTypes";

import { ModalAddedCoefficientName } from "../building-cofficient-add-name";
import { ModalAddedCoefficientType } from "../modal-coefficient-type-add";
import { ModalEditCoefficientType } from "../../coefficient-type-modals/coefficient-type-update";
import { ICoefficientType } from "@/types";

export function ModalAddedCoefficient({
  isOpen,
  onClose,
  buildingId,
}: {
  isOpen: boolean;
  onClose: () => void;
  buildingId: string;
}) {
  const { data: coefficientTypeGroups = [] } =
    useCoefficientTypesByBuildingId(buildingId);

  const createCoefficientType = useCreateCoefficientType();
  const deleteCoefficientType = useDeleteCoefficientType();

  // Edit modal uchun state
  const [editItem, setEditItem] = useState<ICoefficientType | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Yangi Type yaratish state
  const [typeName, setTypeName] = useState("");
  const [rate, setRate] = useState<number | "">("");
  const [coefficientId, setCoefficientId] = useState("");

  const handleCreateCoefficientType = async () => {
    if (!typeName || !coefficientId) {
      toast.error("Заполните все поля");
      return;
    }

    await createCoefficientType.mutateAsync({
      name: typeName.trim(),
      rate: Number(rate),
      coefficient_id: Number(coefficientId),
    });

    toast.success("Тип коэффициента создан");
    setTypeName("");
    setRate("");
    setCoefficientId("");
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCoefficientType.mutateAsync(id);
      toast.success("Тип коэффициента удалён");
    } catch {
      toast.error("Ошибка при удалении");
    }
  };

  return (
    <>
      {/* Edit modal */}
      <ModalEditCoefficientType
        open={editOpen}
        onClose={() => setEditOpen(false)}
        item={editItem}
      />

      <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-indigo-200 via-indigo-100 to-indigo-100 py-6 px-3">
        <div className="mb-4">
          <ModalAddedCoefficientName
            buildingId={buildingId}
            onSuccess={() => {}}
          />
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden ">
          <div className="overflow-x-auto">
            {coefficientTypeGroups.map((group) => (
              <div key={group.id} className="flex flex-col gap-4">
                {/* Header */}
                <div className="bg-indigo-50/50 border-y border-indigo-100">
                  <div className="py-3 px-6 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <ModalAddedCoefficientType
                      buildingId={buildingId}
                      onSuccess={() => {}}
                    />
                  </div>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-3">
                  <div className="py-1 px-6 border-r border-gray-200">
                    Название коэффициента здания
                  </div>
                  <div className="py-1 px-6 border-r border-gray-200">
                    Коэффициента ставка
                  </div>
                  <div></div>
                </div>

                {/* Empty State */}
                {group.bcts.length === 0 ? (
                  <div className="py-8 px-6 text-center">
                    <div className="inline-flex flex-col items-center gap-3">
                      <ImFilesEmpty className="text-gray-400" size={32} />
                      <p className="text-gray-600 font-medium">Информация не введена.</p>
                    </div>
                  </div>
                ) : (
                  group.bcts.map((bct, index) => (
                    <div
                      key={bct.id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100 grid grid-cols-3"
                    >
                      <div className="px-6 border-r border-gray-200 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900">{bct.name}</span>
                      </div>

                      <div className="px-6 border-r border-gray-200 flex items-center gap-3">
                        <span className="font-medium text-gray-900">{bct.rate}%</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-300 to-purple-300"
                            style={{ width: `${Math.min(Math.abs(bct.rate), 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="px-6 flex items-center gap-2 justify-end">
                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditItem(bct);
                            setEditOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <MdOutlineModeEditOutline size={22} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(bct.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <MdDeleteOutline size={22} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
