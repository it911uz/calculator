"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDeleteBuilding } from "@/api/hooks/buildings-hook/useBuildings";

interface ModalDeleteBuildingsProps {
  buildingId: string | number;
  onSuccess?: () => void;
}

export function ModalDeleteBuildings({ buildingId,onSuccess}: ModalDeleteBuildingsProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const deleteMutation = useDeleteBuilding();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(Number(buildingId));
      setOpen(false);
      toast.success("Здание успешно удалено");
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (window.location.pathname.includes('/buildings')) {
        router.refresh();
      } else {
        router.push("/buildings");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Ошибка при удалении здания");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="bg-gradient-to-br from-indigo-100 to-white hover:bg-gray-200 px-2 py-1 rounded-[3px] transition-colors"
          disabled={deleteMutation.isPending}
        >
          <MdOutlineDeleteForever 
            size={20} 
            className={`${deleteMutation.isPending ? 'text-gray-400' : 'text-gray-600'}`}
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