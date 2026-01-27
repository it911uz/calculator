"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateApartment } from "@/hooks/useApartments";
import { ApartmentFormData, IApartment } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { MdEdit } from "react-icons/md";
interface ApiError {
  message: string;
  detail?: string;
  [key: string]: unknown;
}
interface Props {
  apartment: IApartment;
}

export function ModalUpdateApartments({ apartment }: Props) {
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateApartment();

  const [formData, setFormData] = useState<ApartmentFormData>({
    number: apartment.number ?? "",
    floor: apartment.floor ?? 0,
    room_count: apartment.room_count ?? 0,
    area: apartment.area ?? "",
    final_price: apartment.final_price ?? "",
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setFormData({
        number: apartment.number ?? "",
        floor: apartment.floor ?? 0,
        room_count: apartment.room_count ?? 0,
        area: apartment.area ?? "",
        final_price: apartment.final_price ?? "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const currentBctIds: number[] = Array.isArray(apartment.bct_ids)
        ? apartment.bct_ids
        : [];

      const payload: Partial<IApartment> = {
        number: String(formData.number),
        floor: Number(formData.floor),
        area: String(formData.area),
        room_count: Number(formData.room_count),
        final_price: String(formData.final_price),
        building_id: apartment.building_id,
        bct_ids: currentBctIds,
      };

      await updateMutation.mutateAsync({
        id: Number(apartment.id),
        data: payload,
      });

      toast.success("Обновлено успешно");
      setOpen(false);
    } catch (error: unknown) {
      let errorMessage = "Xatolik yuz berdi";

      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(error.message) as ApiError;
          errorMessage = parsed.detail || parsed.message || error.message;
        } catch {
          errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="rounded-[3px] bg-gradient-to-br from-indigo-100 to-white px-2 py-1 flex items-center gap-1 transition-all hover:border-indigo-300 border border-transparent shadow-sm">
          <MdEdit size={16} className="text-blue-600" />
          <span className="text-sm">Редактирование</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Изменить квартиру № {apartment.number}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Номер квартиры</label>
              <input
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Этаж</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Площадь (м²)</label>
              <input
                type="number"
                step="0.01"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Количество комнат</label>
              <input
                type="number"
                name="room_count"
                value={formData.room_count}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Цена (сум)</label>
            <input
              type="number"
              name="final_price"
              value={formData.final_price}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded text-sm hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-indigo-800 text-white rounded text-sm disabled:bg-gray-400 hover:bg-indigo-900 transition-colors"
            >
              {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}