import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useComplexStore } from "@/modules/complex/complex.store";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { toast } from "sonner";

export function ModalDeleteComplex({
  buildingId,
}: {
  buildingId: string | number;
}) {
  const { removeComplex } = useComplexStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await removeComplex(Number(buildingId));
      setOpen(false);
      toast.success("Успешно удалено")
      router.push("/complex");
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
