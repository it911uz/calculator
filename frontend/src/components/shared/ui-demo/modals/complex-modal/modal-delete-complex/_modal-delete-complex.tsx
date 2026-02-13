"use client";
import { useDeleteComplex } from "@/action/hooks/complex-hook/delete-complex";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { ModalDeleteComplexProps } from "@/types/props.types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { toast } from "sonner";


export function ModalDeleteComplex({complexId}:ModalDeleteComplexProps

) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteMutation = useDeleteComplex()


  const handleDelete = async () => {
  try {
    await deleteMutation.mutateAsync({ id: Number(complexId) });
    setOpen(false);
    router.push("/complex"); 
  } catch (e) {
    console.error(e);
    toast.error("Ошибка при удалении");
  }
};
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-[3px] transition-colors"
          disabled={deleteMutation.isPending}
        >
          <MdOutlineDeleteForever 
            size={20} 
            className={`${deleteMutation.isPending ? 'text-gray-400' : 'text-gray-400'}`}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-lg font-semibold text-center">
          Удалить здание?
        </DialogTitle>
        
        <div className="py-4">
          <p className="text-center text-gray-600 mb-6">
            Вы уверены, что хотите удалить это здание? 
            Это действие нельзя отменить.
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors min-w-[80px]"
              disabled={deleteMutation.isPending}
            >
              Нет
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 bg-red-300 text-white rounded hover:bg-red-400 transition-colors disabled:opacity-50 min-w-[80px]"
            >
              {deleteMutation.isPending ? "Удаление..." : "Да"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
