"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ICoefficientType } from "@/types";
import { useUpdateCoefficientType } from "@/hooks/useCoefficientTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  item: ICoefficientType | null;
}

export function ModalEditCoefficientType({ open, onClose, item }: Props) {
  const updateMutation = useUpdateCoefficientType();

  const [name, setName] = useState("");
  const [rate, setRate] = useState<number | "">("");

  // item kelganda state’larni to‘ldirish
  useEffect(() => {
    if (item) {
      setName(item.name);
      setRate(item.rate);
    }
  }, [item]);

  const handleUpdate = async () => {
    if (!item || rate === "" || !name) {
      toast.error("Заполните все поля");
      return;
    }

    await updateMutation.mutateAsync({
      id: item.id,
      data: {
        name: name.trim(),
        rate: Number(rate),
        building_id: item.building_id,
      },
    });

    toast.success("Тип коэффициента обновлён");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <label className="flex flex-col gap-2 text-sm">
          Ставка: %
          <Input
            type="number"
            min={0}
            max={100}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          Имя типа:
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-[#46479f] text-white rounded-sm px-4 h-8"
          >
            Сохранить
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
