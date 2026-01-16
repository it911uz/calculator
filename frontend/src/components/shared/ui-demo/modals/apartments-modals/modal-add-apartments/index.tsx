"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { toast } from "sonner";
import { useApartmentsStore } from "@/modules/apartments/apartments.store";

type ModalProps = {
  onSuccess?: () => Promise<void>; 
};
export const ModalAddedApartments: FC<ModalProps> = ({ onSuccess }) => {
  const { creteApartments } = useApartmentsStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    floor: "",
    room_count: "",
    final_price: "",
    building_id: "",
    btc_ids: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.number.trim()) {
      return;
    }
    if (onSuccess) await onSuccess();

    setLoading(true);
    try {
      await creteApartments({
        number: formData.number,
        floor: formData.floor || "",
        room_count: formData.room_count || "",
        final_price: formData.final_price || "",
        building_id: formData.building_id || "",
        btc_ids: Array.isArray(formData.btc_ids)
          ? formData.btc_ids.map(Number)
          : [],
      });

      setFormData({
        number: "",
        floor: "",
        room_count: "",
        final_price: "",
        building_id: "",
        btc_ids: "",
      });
      setOpen(false);
      toast.success("Добавлено успешно");
    } catch (error) {
      console.error("Ошибка:", error);
      toast.error("Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#282964] px-2 py-1 rounded-[3px] leading-5 text-white text-sm hover:bg-[#1f2050] transition-colors">
          Добавлять +
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Добавлять здания</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="py-4 grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Номер *
            </label>
            <Input
              id="number"
              name="number"
              type="number"
              placeholder="Имя комплекс"
              value={formData.number}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Количество комната
            </label>
            <Input
              id="floor"
              name="floor"
              type="number"
              placeholder="Количество этажей"
              value={formData.floor}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
             Цена за единицу
            </label>
            <Input
              id="final_price"
              name="final_price"
              type="number"
              placeholder="Базовая цена"
              value={formData.final_price}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Идентификатор здания
            </label>
            <Input
              id="building_id"
              name="building_id"
              type="number"
              placeholder="Единица цены"
              value={formData.building_id}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Коэффициент
            </label>
            <Input
              id="coefficient_ids"
              name="coefficient_ids"
              type="number"
              placeholder="Максимальный коэффициент"
              value={formData.btc_ids}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          <DialogFooter className="pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="mr-2"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.number.trim()}
              className="bg-[#282964] hover:bg-[#1f2050]"
            >
              {loading ? "Добавляется..." : "Добавлять"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
