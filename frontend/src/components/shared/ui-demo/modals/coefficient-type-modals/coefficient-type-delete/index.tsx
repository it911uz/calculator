"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { toast } from "sonner";
import { useDeleteCoefficientType } from "@/api/hooks/coefficient-type-hook/useCoefficientTypes";

interface ModalDeleteCoefficientTypeProps {
  coefficientTypeId: number;
  buildingId: number;
  onSuccess?: () => void;
}
export function ModalDeleteCoefficientType({
  coefficientTypeId,
  buildingId,
  onSuccess,
}: ModalDeleteCoefficientTypeProps) {
  const [open, setOpen] = useState(false);

  const deleteMutation = useDeleteCoefficientType(buildingId);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(coefficientTypeId);
      toast.success("Коэффициент удалён");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="bg-gradient-to-br from-indigo-100 to-white hover:bg-gray-200 px-2 py-1 rounded-[3px]"
          disabled={deleteMutation.isPending}
        >
          <MdOutlineDeleteForever
            size={20}
            className={
              deleteMutation.isPending ? "text-gray-400" : "text-gray-500"
            }
          />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-lg font-semibold text-center">
          Удалить коэффициент?
        </DialogTitle>

        <div className="py-4">
          <p className="text-center text-gray-600 mb-6">
            Вы уверены, что хотите удалить этот коэффициент?
            Это действие нельзя отменить.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setOpen(false)}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 min-w-[80px]"
            >
              Нет
            </button>

            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 min-w-[80px]"
            >
              {deleteMutation.isPending ? "Удаление..." : "Да"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
