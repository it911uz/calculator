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
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import { useBuildingsStore } from "@/modules/buildings/buildings.store";
import { useComplexStore } from "@/modules/complex/complex.store";
import { useCoefficientTypeStore } from "@/modules/coefficients-types/coefficients-types.store";
import type { ICoefficientType } from "@/modules/coefficients-types/coefficients-types.types";
import { useCoefficientStore } from "@/modules/coefficients/coefficients.store";
type PriceUnit = "UZS" | "USD";
type ModalProps = {
  onSuccess?: () => Promise<void>; 
};
export const ModalAddedBuilding:FC<ModalProps> =({ onSuccess }) => {
  const { createBuildings } = useBuildingsStore();
  const { complex, fetchAllComplex } = useComplexStore();
  const {
    currentCoefficient,
    fetchCoefficientTypeById,
    loading: coefficientLoading,
  } = useCoefficientTypeStore();

  const {creteCoefficient} = useCoefficientStore()



  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    floor_count: "",
    base_price: "",
    price_unit: "UZS" as PriceUnit,
    max_coefficient: "",
    complex_id: "",
  });

  useEffect(() => {
    fetchAllComplex();
  }, [fetchAllComplex]);

  useEffect(() => {
    if (formData.complex_id) {
      fetchCoefficientTypeById(Number(formData.complex_id));
      setFormData((prev) => ({ ...prev, max_coefficient: "" }));
    }
  }, [formData.complex_id, fetchCoefficientTypeById]);

  const coefficientOptions: ICoefficientType[] = currentCoefficient
    ? (Object.values(currentCoefficient).flat() as ICoefficientType[])
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (onSuccess)  onSuccess();
    if (name === "floor_count" || name === "base_price" || name === "max_coefficient") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, [name]: "" }));
        return;
      }

      const num = Number(value);

      if (!Number.isInteger(num) || num < 1) return;

      setFormData((prev) => ({ ...prev, [name]: String(num) }));
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

    setLoading(true);
    try {
      await createBuildings({
        name: formData.name,
        floor_count: Number(formData.floor_count),
        base_price: Number(formData.base_price),
        price_unit: formData.price_unit,
        max_coefficient: Number(formData.max_coefficient),
        complex_id: formData.complex_id,
      });

      toast.success("Добавлено успешно");
      setOpen(false);

      setFormData({
        name: "",
        floor_count: "",
        base_price: "",
        price_unit: "UZS",
        max_coefficient: "",
        complex_id: "",
      });
    } catch (err) {
      console.log(err);
      
      toast.error("Ошибка при добавлении" );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#282964] px-2 py-1 rounded text-white text-sm hover:bg-[#1f2050] transition-colors">
          Добавлять +
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Добавлять здания</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Комплекс</label>
            <select
              name="complex_id"
              value={formData.complex_id}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full h-10 border rounded px-3"
            >
              <option value="">Выберите комплекс</option>
              {complex.map((item) => (
                <option key={item.id} value={item.id}>
                 id {item.id} ---  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Количество этажей</label>
            <Input
              name="floor_count"
              type="number"
              min={1}
              value={formData.floor_count}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Имя здания</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Базовая цена</label>
            <Input
              name="base_price"
              type="number"
              min={1}
              value={formData.base_price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
               Максимал коэффициент
            </label>
            <Input
              name="max_coefficient"
              type="number"
              min={1}
              value={formData.max_coefficient}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Единица цены</label>
            <select
              name="price_unit"
              value={formData.price_unit}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3"
            >
              <option value="UZS">UZS</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <DialogFooter className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading} variant="outline" className="bg-[#d0d5f6]">
              {loading ? "Добавляется..." : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
