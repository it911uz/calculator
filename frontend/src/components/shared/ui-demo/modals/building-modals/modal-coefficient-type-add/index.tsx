"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { toast } from "sonner";

import {
  useCoefficientTypesByBuildingId,
  useCreateCoefficientType,
  useDeleteCoefficientType,
  useUpdateCoefficientType,
} from "@/hooks/useCoefficientTypes";

import { useDeleteCoefficient } from "@/hooks/useCoefficient";

interface ModalAddedCoefficientNameProps {
  onSuccess?: () => void;
  buildingId: string | number;
}

export const ModalAddedCoefficientType = ({
  onSuccess,
  buildingId,
}: ModalAddedCoefficientNameProps) => {
  const [open, setOpen] = useState(false);

  const { data: coefficientTypeGroups = [] } = useCoefficientTypesByBuildingId(
    buildingId as number,
  );
  const createCoefficientType = useCreateCoefficientType();

  // STATES
  const [typeName, setTypeName] = useState("");
  const [rate, setRate] = useState<number | "">("");

  const coefficientId = useMemo(() => {
    return coefficientTypeGroups[0]?.id ?? null;
  }, [coefficientTypeGroups]);

  const handleCreateCoefficientType = async () => {
    if (!typeName || rate === "") {
      toast.error("Заполните все поля");
      return;
    }

    if (!coefficientId) {
      toast.error("Коэффициент не найден");
      return;
    }

    await createCoefficientType.mutateAsync({
      name: typeName.trim(),
      rate: Number(rate),
      coefficient_id: coefficientId,
    });

    toast.success("Тип коэффициента создан");

    setTypeName("");
    setRate("");
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#46479f] px-3 py-1 rounded text-white text-sm hover:bg-[#1f2050] transition-colors mx-6">
          Создать тип +
        </button>
      </DialogTrigger>

      <DialogContent className="w-md">
        <div className="space-y-6">
          <label className="flex flex-col gap-2 text-sm">
            Имя типа:
            <Input
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              placeholder="Имя типа"
              className="bg-white"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Ставка: %
            <Input
              type="number"
              value={rate}
              min={0}
              max={100}
              step={1}
              placeholder="Ставка"
              className="bg-white"
              onChange={(e) => {
                const raw = e.target.value;

                if (raw === "") {
                  setRate("");
                  return;
                }

                const value = Number(raw);
                if (value < 0 || value > 100) return;

                setRate(value);
              }}
            />
          </label>

          <div className="flex justify-end">
            <button
              className="bg-[#46479f] text-white rounded-sm h-7 px-4"
              onClick={handleCreateCoefficientType}
            >
              Создать
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
