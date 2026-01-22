import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useDeleteApartment } from "@/hooks/useApartments";
import { useApartmentsStore } from "@/modules/apartments/apartments.store";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { toast } from "sonner";


interface ModalDeleteApartmentsProps {
  buildingId: string | number;
  onSuccess?: () => void;
}
export function ModalDeleteApartments({ buildingId, onSuccess}: ModalDeleteApartmentsProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

 const deleteMutation = useDeleteApartment()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(Number(buildingId));
      setOpen(false);
      toast.success("Успешно удалено")
      if (onSuccess) {
        onSuccess();
      }
       if (window.location.pathname.includes('/apartments')) {
        router.refresh();
      } else {
        router.push("/apartments");
      }
    } catch (e) {
      console.error(e);
      toast.error("Ошибка")
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-[3px]">
          <MdOutlineDeleteForever size={20} className="text-red-500" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg text-center font-semibold">
          Здание удалить?
        </DialogTitle>
        <div className="">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1 border rounded"
            >
              нет
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              да
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
