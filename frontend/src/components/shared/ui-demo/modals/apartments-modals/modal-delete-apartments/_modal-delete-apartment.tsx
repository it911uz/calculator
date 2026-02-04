"use client";

import { useDeleteApartment } from "@/action/hooks/apartments-hook/delete-aparment.hook";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { toast } from "sonner";

interface ModalDeleteApartmentsProps {
  apartmentId: string | number;
  onSuccess?: () => void;
}

export function ModalDeleteApartments({ 
  apartmentId, 
  onSuccess 
}: ModalDeleteApartmentsProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const deleteMutation = useDeleteApartment();

  const handleDelete = async () => {
  try {
    await deleteMutation.mutateAsync({id: Number(apartmentId)});
    setOpen(false);

    router.push("/apartments");
    router.refresh();

  } catch (e) {
    toast.error("Ошибка при удалении квартиры");
  }
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-gray-200 hover:text-white bg-indigo-900 px-3 py-1 rounded-[3px]"
        >
          <MdOutlineDeleteForever  />
         
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-lg font-semibold text-center mb-4">
          Удалить квартиру?
        </DialogTitle>
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Вы уверены, что хотите удалить эту квартиру? Это действие нельзя отменить.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setOpen(false)}
              className="px-6 bg-gray-400 text-white  py-0.5 rounded-sm"
            >
              Отмена
            </button>
            <button
              onClick={handleDelete}
              className="px-6 bg-red-400 text-white  py-0.5 rounded-sm"
            >
              Удалить
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}