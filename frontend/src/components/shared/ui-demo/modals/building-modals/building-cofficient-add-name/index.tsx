"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { createCoefficient } from "@/action/coefficients.action";

interface ModalAddedCoefficientNameProps {
  onSuccess?: () => void;
  buildingId: string | number;
}

export const ModalAddedCoefficientName = ({ 
  onSuccess, 
  buildingId 
}: ModalAddedCoefficientNameProps) => {
  const [coefficientName, setCoefficientName] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCoefficient = async () => {
    if (!coefficientName.trim()) {
      toast.error("Введите имя коэффициента");
      return;
    }

    setIsLoading(true);
    try {
      await createCoefficient({name: coefficientName.trim(), building_id: Number(buildingId)});

      toast.success("Коэффициент создан");
      setCoefficientName("");
      setOpen(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Ошибка при создании коэффициента");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#46479f] px-3 py-1 rounded text-white text-sm hover:bg-[#1f2050] transition-colors">
          Добавить коэффициента +
        </button>
      </DialogTrigger>
      <DialogContent className="w-md">
        <div className="space-y-6">
          <label className="text-sm font-medium">Имя коэффициента:</label>
          <Input
            value={coefficientName}
            onChange={(e) => setCoefficientName(e.target.value)}
            placeholder="Имя коэффициента"
            className="bg-white w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateCoefficient();
              }
            }}
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <button
              className="bg-[#46479f] text-white rounded-sm h-9 px-4 hover:bg-[#3a3b8a] transition-colors disabled:opacity-50"
              onClick={handleCreateCoefficient}
              disabled={isLoading || !coefficientName.trim()}
            >
              {isLoading ? "Создание..." : "Создать коэффициент"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};