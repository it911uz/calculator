"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useComplexes } from "@/action/hooks/complex-hook/get-complexes";
import { useBuildings } from "@/action/hooks/buildings-hook/get-buildings";
import { toast } from "sonner";
import { ChevronRight, RefreshCcw, FileUp } from "lucide-react";
import { useBulkCreateApartments } from "@/action/hooks/create-excel-hook/use-bulk-create-apartments";
import type { IComplex } from "@/types/complex.types";
import type { IBuildings } from "@/types/building.types";

const ModaDataSendingForExel = () => {
  // States
  const [open, setOpen] = useState(false);
  const [selectedComplexId, setSelectedComplexId] = useState<string>("");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { data: complexesData = [], isLoading: isComplexesLoading } = useComplexes();
  const { data: buildingsData = [], isLoading: isBuildingsLoading } = useBuildings({});
  const uploadMutation = useBulkCreateApartments(); 

  const complexes = (complexesData || []) as IComplex[];
  const buildings = (buildingsData || []) as IBuildings[];

  const filteredBuildings = useMemo(() => {
    if (!selectedComplexId) return [];
    return buildings.filter((b) => {
      const complexId =
        typeof b.complex_id === "object" && b.complex_id !== null
          ? (b.complex_id as { id: number | string }).id
          : b.complex_id;
      return String(complexId) === String(selectedComplexId);
    });
  }, [buildings, selectedComplexId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBuildingId) return toast.error("Пожалуйста, выберите здание");
    if (!file) return toast.error("Пожалуйста, выберите Excel файл");

    uploadMutation.mutate(
      { 
        buildingId: selectedBuildingId, 
        file: file 
      },
      {
        onSuccess: (res) => {
          if (res.data) {
            setOpen(false);
            resetForm();
          }
        }
      }
    );
  };

  const resetForm = () => {
    setSelectedComplexId("");
    setSelectedBuildingId("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#282964] text-white px-4 py-1 rounded-sm text-sm hover:bg-[#1f2050] transition-colors flex items-center gap-2">
          Загрузить Excel
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Импорт квартир
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Комплекс *</label>
            <select
              value={selectedComplexId}
              onChange={(e) => {
                setSelectedComplexId(e.target.value);
                setSelectedBuildingId(""); 
              }}
              className="w-full p-2.5 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              required
              disabled={isComplexesLoading || uploadMutation.isPending}
            >
              <option value="">{isComplexesLoading ? "Загрузка..." : "Выберите комплекс"}</option>
              {complexes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Здание *</label>
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-gray-50"
              disabled={!selectedComplexId || isBuildingsLoading || uploadMutation.isPending}
              required
            >
              <option value="">Выберите здание</option>
              {filteredBuildings.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Excel файл (.xls, .xlsx) *</label>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                accept=".xls,.xlsx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="excel-upload"
                disabled={uploadMutation.isPending}
              />
              <label
                htmlFor="excel-upload"
                className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
              >
                <FileUp size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600 truncate">
                  {file ? file.name : "Выберите файл"}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={uploadMutation.isPending}
              className="flex-1 bg-gradient-to-r from-[#400189] to-[#46479f] text-white font-semibold py-2.5 rounded-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {uploadMutation.isPending ? "Загрузка..." : "Загрузить"} <ChevronRight size={18} />
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              disabled={uploadMutation.isPending}
              className="px-4 border border-gray-300 rounded-sm hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModaDataSendingForExel;