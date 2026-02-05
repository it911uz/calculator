"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateBuilding } from "@/action/hooks/buildings-hook/update-building";
import type { ModalUpdateBuildingsProps } from "@/types/props.types";



export function ModalUpdateBuildings({
  building,
  onSuccess,
}: ModalUpdateBuildingsProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(building.name || "");
  const [floorCount, setFloorCount] = useState(building.floor_count || 0);
  const [maxCoefficient, setMaxCoefficient] = useState<number | "">(
    building.max_coefficient || "",
  );
  const [basePrice, setBasePrice] = useState(building.base_price || 0);
  const updateMutation = useUpdateBuilding();

  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await updateMutation.mutateAsync({
      id: building.id,
      data: {
        name,
        floor_count: floorCount,
        ...(maxCoefficient !== "" && { max_coefficient: Number(maxCoefficient) }),
        ...(basePrice !== "" && { base_price: Number(basePrice) }),

        price_unit: building.price_unit,
        complex_id: building.complex_id,
      },
    });
    setOpen(false);
    onSuccess?.();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-gradient-to-br from-indigo-100 to-white px-2 py-1 rounded-[3px] leading-5">
          Изменять
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-lg font-semibold text-center mb-4">
          Обновить здание
        </DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Название
            <Input
              placeholder="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Этажи
            <Input
              type="number"
              placeholder="Этажи"
              value={floorCount}
              onChange={(e) => setFloorCount(Number(e.target.value))}
            />
          </label>
          <label>
            Макс. коэффициент
            <Input
              type="number"
              placeholder="Макс. коэффициент"
              value={maxCoefficient}
              min={0.01}
              max={100}
              step={0.01}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setMaxCoefficient("");
                  return;
                }
                let value = Number(raw);
                if (value < 0.01) value = 0.01;
                if (value > 100) value = 100;
                setMaxCoefficient(Number(value.toFixed(2)));
              }}
            />
          </label>
          <label>
            Базовая цена
            <Input
              type="number"
              placeholder="Базовая цена"
              value={basePrice}
              min={0.01}
              step={0.01}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setBasePrice(0.01);
                  return;
                }

                let value = Number(raw);
                if (value < 0.01) value = 0.01;
                setBasePrice(Number(value.toFixed(2)));
              }}
            />
          </label>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 min-w-[80px]"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-800 text-white rounded hover:bg-indigo-700 min-w-[80px]"
            >
              Сохранить
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
