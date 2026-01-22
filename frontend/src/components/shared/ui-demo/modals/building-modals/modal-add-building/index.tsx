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
import { FC,  useState } from "react";
import { toast } from "sonner";
import { useComplexes } from "@/hooks/useComplex";
import { useCreateBuilding } from "@/hooks/useBuildings";

type PriceUnit = "UZS" | "USD";
type ModalProps = {
  onSuccess?: () => void;
};

export const ModalAddedBuilding: FC<ModalProps> = ({ onSuccess }) => {
  const { data: complexes = [] } = useComplexes();
  const createMutation = useCreateBuilding();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    floor_count: "",
    base_price: "",
    price_unit: "UZS" as PriceUnit,
    max_coefficient: "",
    complex_id: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "floor_count" || name === "base_price" || name === "max_coefficient") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Введите имя здания");
      return;
    }

    if (!formData.complex_id) {
      toast.error("Выберите комплекс");
      return;
    }

    const buildingData = {
      name: formData.name,
      floor_count: Number(formData.floor_count) || 1,
      base_price: Number(formData.base_price) || 0,
      price_unit: formData.price_unit,
      max_coefficient: Number(formData.max_coefficient) || 1,
      complex_id: formData.complex_id,
    };

    try {
      await createMutation.mutateAsync(buildingData);
      
      toast.success("Здание успешно добавлено");
      setOpen(false);
      
      // Formani tozalash
      setFormData({
        name: "",
        floor_count: "",
        base_price: "",
        price_unit: "UZS",
        max_coefficient: "",
        complex_id: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      
      toast.error("Ошибка при добавлении здания");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#282964] px-3 py-1 rounded text-white text-sm hover:bg-[#1f2050] transition-colors">
          Добавить здание +
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Добавить здание</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Комплекс *</label>
            <select
              name="complex_id"
              value={formData.complex_id}
              onChange={handleChange}
              required
              disabled={createMutation.isPending}
              className="w-full h-10 border rounded px-3 bg-white"
            >
              <option value="">Выберите комплекс</option>
              {complexes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Название здания *</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите название"
              required
              disabled={createMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Количество этажей *</label>
            <Input
              name="floor_count"
              type="number"
              min="1"
              value={formData.floor_count}
              onChange={handleChange}
              placeholder="Например: 5"
              required
              disabled={createMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Базовая цена *</label>
            <Input
              name="base_price"
              type="number"
              min="0"
              step="0.01"
              value={formData.base_price}
              onChange={handleChange}
              placeholder="Например: 1000000"
              required
              disabled={createMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Максимальный коэффициент *</label>
            <Input
              name="max_coefficient"
              type="number"
              min="1"
              step="0.01"
              value={formData.max_coefficient}
              onChange={handleChange}
              placeholder="Например: 1.5"
              required
              disabled={createMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Валюта</label>
            <select
              name="price_unit"
              value={formData.price_unit}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3 bg-white"
              disabled={createMutation.isPending}
            >
              <option value="UZS">UZS (Сум)</option>
              <option value="USD">USD (Доллар)</option>
            </select>
          </div>

          <div className="col-span-2">
            <DialogFooter className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createMutation.isPending}
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="bg-[#282964] hover:bg-[#1f2050] text-white"
              >
                {createMutation.isPending ? "Добавление..." : "Добавить"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};