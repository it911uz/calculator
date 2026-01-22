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
import { useCreateApartment } from "@/hooks/useApartments";
import { useBuildings } from "@/hooks/useBuildings";

type ModalProps = {
  onSuccess?: () => void; 
};

export const ModalAddedApartments: FC<ModalProps> = ({ onSuccess }) => {
  const { data: buildings = [] } = useBuildings();
  const createMutation = useCreateApartment();
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    floor: "",
    room_count: "",
    final_price: "",
    building_id: "",
    area: "",
    bct_ids: "", 
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log("🧪 FORM DATA перед отправкой:", formData);

    if (!formData.number.trim()) {
      toast.error("Введите номер квартиры");
      return;
    }

    if (!formData.building_id) {
      toast.error("Выберите здание");
      return;
    }

    // Swagger format
    const apartmentData = {
      number: formData.number,
      floor: Number(formData.floor) || 0,
      room_count: Number(formData.room_count) || 0,
      final_price: formData.final_price || "0",
      building_id: formData.building_id,
      area: formData.area || "0",
      bct_ids: formData.bct_ids 
        ? formData.bct_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
        : [0], 
    };

    console.log("🚀 Отправляемые данные на сервер:", apartmentData);

    try {
      await createMutation.mutateAsync(apartmentData);

      toast.success("Квартира успешно добавлена");
      setOpen(false);
      
      setFormData({
        number: "",
        floor: "0",
        room_count: "0",
        final_price: "0",
        building_id: "",
        area: "0",
        bct_ids: "0", 
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error(" Ошибка при добавлении квартиры:", error);
      
      if (error.message?.includes("BuildingCoefficientType")) {
        toast.error("Ошибка: Указанный коэффициент не существует. Используйте существующие ID коэффициентов.");
      } else if (error.message?.includes("Ошибка сервера")) {
        const serverError = error.message.replace("Ошибка сервера: ", "");
        toast.error(`Ошибка: ${serverError}`);
      } else {
        toast.error(`Ошибка: ${error.message || "Неизвестная ошибка"}`);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "floor" || name === "room_count") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Price validation (decimal numbers)
    if (name === "final_price" || name === "area") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#282964] px-3 py-1 rounded-[3px] text-white text-sm hover:bg-[#1f2050] transition-colors">
          Добавить квартиру +
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Добавить квартиру</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="py-4 grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="number" className="text-sm font-medium">
              Номер квартиры *
            </label>
            <Input
              id="number"
              name="number"
              type="text"
              placeholder="Например: 101"
              value={formData.number}
              onChange={handleChange}
              required
              disabled={createMutation.isPending}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="floor" className="text-sm font-medium">
              Этаж *
            </label>
            <Input
              id="floor"
              name="floor"
              type="number"
              placeholder="0 или больше"
              value={formData.floor}
              onChange={handleChange}
              required
              disabled={createMutation.isPending}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="area" className="text-sm font-medium">
              Площадь (м²) *
            </label>
            <Input
              id="area"
              name="area"
              type="text"
              placeholder="Например: 65.5"
              value={formData.area}
              onChange={handleChange}
              required
              disabled={createMutation.isPending}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="room_count" className="text-sm font-medium">
              Количество комнат *
            </label>
            <Input
              id="room_count"
              name="room_count"
              type="number"
              placeholder="0 или больше"
              value={formData.room_count}
              onChange={handleChange}
              required
              disabled={createMutation.isPending}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="final_price" className="text-sm font-medium">
              Цена *
            </label>
            <Input
              id="final_price"
              name="final_price"
              type="text"
              placeholder="Например: 15000000"
              value={formData.final_price}
              onChange={handleChange}
              required
              disabled={createMutation.isPending}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="building_id" className="text-sm font-medium">
              Здание *
            </label>
            <select
              id="building_id"
              name="building_id"
              value={formData.building_id}
              onChange={handleChange}
              required
              disabled={createMutation.isPending}
              className="w-full h-10 border rounded px-3 bg-white"
            >
              <option value="">Выберите здание</option>
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name} 
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="bct_ids" className="text-sm font-medium">
              ID коэффициентов (через запятую)
            </label>
            <Input
              id="bct_ids"
              name="bct_ids"
              type="text"
              placeholder="Обязательно: 0"
              value={formData.bct_ids}
              onChange={handleChange}
              disabled={createMutation.isPending}
              className="w-full"
            />
            
          </div>

          

          <DialogFooter className="col-span-2 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createMutation.isPending}
              className="mr-2"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || 
                !formData.number.trim() || 
                !formData.building_id ||
                !formData.area}
              className="bg-[#282964] hover:bg-[#1f2050] text-white"
            >
              {createMutation.isPending ? "Добавление..." : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};