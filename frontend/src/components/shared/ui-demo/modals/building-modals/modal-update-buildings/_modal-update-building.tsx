"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateBuilding } from "@/action/hooks/buildings-hook/update-building";
import type { ModalUpdateBuildingsProps } from "@/types/props.types";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useUpdateBuildingImage } from "@/action/hooks/buildings-hook/building-img";

export function ModalUpdateBuildings({
  building,
  onSuccess,
}: ModalUpdateBuildingsProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(building.name || "");
  const [floorCount, setFloorCount] = useState(Number(building.floor_count) || 0);
  const [maxCoefficient, setMaxCoefficient] = useState<number | "">(
    Number(building.max_coefficient) || "",
  );
  const [basePrice, setBasePrice] = useState(Number(building.base_price) || 0);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(building.image_url || "");

  const updateMutation = useUpdateBuilding();
  const imageMutation = useUpdateBuildingImage();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  try {
    await updateMutation.mutateAsync({
      id: building.id,
      data: {
        name,
        floor_count: floorCount,
        max_coefficient: maxCoefficient === "" ? undefined : Number(maxCoefficient),
        base_price: Number(basePrice),
        complex_id: building.complex_id,
        price_unit: building.price_unit,
      },
    });

    if (selectedFile) {
      await imageMutation.mutateAsync({
        id: building.id,
        file: selectedFile,
      });
    }

    setOpen(false);
    onSuccess?.();
  } catch (error) {
    console.error("Update process failed:", error);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-gradient-to-br from-indigo-100 to-white px-2 py-1 rounded-[3px] leading-5 text-indigo-900 border border-indigo-200 hover:shadow-sm">
          Изменять
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Обновить здание
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Rasm yuklash qismi */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Фотография здания</span>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    fill 
                    className="object-cover"
                    unoptimized 
                  />
                </div>
              )}
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <UploadCloud size={20} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Нажмите для загрузки</span>
                </div>
                <Input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <label className="text-sm font-medium">
            Название
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm font-medium">
              Этажи
              <Input
                type="number"
                value={floorCount}
                onChange={(e) => setFloorCount(Number(e.target.value))}
                className="mt-1"
              />
            </label>
            <label className="text-sm font-medium">
              Макс. коэффициент
              <Input
                type="number"
                value={maxCoefficient}
                step={0.01}
                onChange={(e) => setMaxCoefficient(e.target.value === "" ? "" : Number(e.target.value))}
                className="mt-1"
              />
            </label>
          </div>

          <label className="text-sm font-medium">
            Базовая цена ({building.price_unit})
            <Input
              type="number"
              value={basePrice}
              step={0.01}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="mt-1"
            />
          </label>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="min-w-24"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-indigo-800 hover:bg-indigo-700 min-w-24"
            >
              {updateMutation.isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Сохранить"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}