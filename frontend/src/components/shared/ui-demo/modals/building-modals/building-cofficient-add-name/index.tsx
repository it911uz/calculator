"use client";

import { useCreateCoefficient } from "@/api/hooks/coefficient-hook/create-coefficient";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

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
  const { mutate: createMutation, isPending } = useCreateCoefficient();
  const handleCreateCoefficient = () => {
    const trimmedName = coefficientName.trim();
    if (!trimmedName) {
      toast.error("Введите имя коэффициента");
      return;
    }
    createMutation(
      { 
        name: trimmedName, 
        building_id: Number(buildingId) 
      },
      {
        onSuccess: () => {
          toast.success("Коэффициент создан");
          setCoefficientName("");
          setOpen(false);
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          toast.error("Ошибка при создании коэффициента");
          console.error(error);
        }
      }
    );
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
              if (e.key === "Enter" && !isPending) {
                handleCreateCoefficient();
              }
            }}
            disabled={isPending}
          />
          <div className="flex justify-end">
            <button
              className="bg-[#46479f] text-white rounded-sm h-9 px-4 hover:bg-[#3a3b8a] transition-colors disabled:opacity-50"
              onClick={handleCreateCoefficient}
              disabled={isPending || !coefficientName.trim()}
            >
              {isPending ? "Создание..." : "Создать коэффициент"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};