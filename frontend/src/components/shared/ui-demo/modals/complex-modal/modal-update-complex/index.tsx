"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IComplex } from "@/types";
import { useRouter } from "next/navigation";
import { useUpdateComplex } from "@/action/hooks/complex-hook/update-complex";

const ModalUpdateComplex = ({ complex }: { complex: IComplex }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter()
  const [name, setName] = useState(complex.name);
  const [description, setDescription] = useState(
    complex.description || ""
  );

  const { mutate, isPending } = useUpdateComplex();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        id: complex.id,
        data: {
          name,
          description,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          router.refresh(); 
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-gradient-to-br from-indigo-100 to-white px-2 py-1 rounded-[3px] leading-5">
          Изменять
        </button>
      </DialogTrigger>

      <DialogContent className="w-md">
        <DialogTitle className="text-lg font-semibold  mb-4">
          Обновить объект
        </DialogTitle>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-start">
          <Input
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            disabled={isPending}
            className="bg-indigo-900 text-white py-1 px-3 rounded-sm disabled:opacity-50"
          >
            {isPending ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateComplex;
