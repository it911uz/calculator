"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FC, useState, useEffect } from "react";
import { toast } from "sonner";
import { ICoefficientTypeGroup } from "@/types";
import { useBuildings } from "@/api/hooks/buildings-hook/get-buildings";
import { useCreateApartment } from "@/api/hooks/apartments-hook/create-apartment.hook";
import { getCoefficientTypesByBuildingId } from "@/api/coefficient-types/get-coefficient-type.api";

type ModalProps = {
  onSuccess?: () => void;
};

export const ModalAddedApartments: FC<ModalProps> = ({ onSuccess }) => {
  const { data: buildings = [] } = useBuildings();
  const createMutation = useCreateApartment();

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    number: "",
    floor: "",
    room_count: "",
    final_price: "",
    building_id: "",
    area: "",
    bct_ids: [] as number[],
  });

  const [selectedBuildingFloorCount, setSelectedBuildingFloorCount] = useState<number | null>(null);
  const [coefficientGroups, setCoefficientGroups] = useState<ICoefficientTypeGroup[]>([]);
  const [isLoadingCoefficientGroups, setIsLoadingCoefficientGroups] = useState(false);

  useEffect(() => {
    if (!formData.building_id) {
      setSelectedBuildingFloorCount(null);
      setCoefficientGroups([]);
      return;
    }

    const buildingIdNum = Number(formData.building_id);
    const building = buildings.find((b) => b.id === buildingIdNum);

    if (building) {
      const floorCount = typeof building.floor_count === "string" 
        ? Number(building.floor_count) 
        : building.floor_count;
      setSelectedBuildingFloorCount(floorCount);
    }

    const fetchCoefficients = async () => {
      setIsLoadingCoefficientGroups(true);
      try {
        const data = await getCoefficientTypesByBuildingId(buildingIdNum);
        setCoefficientGroups(data || []);
      } catch (err) {
        console.error("Ошибка при загрузке коэффициентов:", err);
      } finally {
        setIsLoadingCoefficientGroups(false);
      }
    };

    fetchCoefficients();
  }, [formData.building_id, buildings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "floor") {
      if (value === "" || /^\d+$/.test(value)) {
        const floorValue = Number(value);
        if (selectedBuildingFloorCount !== null && floorValue > selectedBuildingFloorCount) {
          toast.error(`Максимальный этаж: ${selectedBuildingFloorCount}`);
          return;
        }
        setFormData((prev) => ({ ...prev, floor: value }));
      }
      return;
    }

    if (name === "building_id") {
      setFormData((prev) => ({
        ...prev,
        building_id: value,
        floor: "",
        bct_ids: [],
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.number.trim()) return toast.error("Введите номер квартиры");
    if (!formData.building_id) return toast.error("Выберите здание");

    const apartmentData = {
      number: formData.number,
      building_id: Number(formData.building_id), 
      floor: Number(formData.floor) || 0,
      room_count: Number(formData.room_count) || 0,
      final_price: formData.final_price || "0",
      area: formData.area || "0",
      bct_ids: formData.bct_ids,
    };

    try {
      await createMutation.mutateAsync(apartmentData);
      toast.success("Квартира успешно добавлена");
      setOpen(false);
      
      setFormData({
        number: "",
        floor: "",
        room_count: "",
        final_price: "",
        building_id: "",
        area: "",
        bct_ids: [],
      });

      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка при добавлении";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#282964] px-3 py-1 rounded-[3px] text-white text-sm hover:bg-[#1f2050] transition-colors">
          Добавить квартиру +
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить квартиру</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Здание */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Здание *</label>
            <select
              name="building_id"
              value={formData.building_id}
              onChange={handleChange}
              required
              className="w-full h-10 border rounded px-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Выберите здание</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Номер квартиры *</label>
            <Input
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Этаж *</label>
            <Input
              name="floor"
              type="number"
              value={formData.floor}
              onChange={handleChange}
              placeholder={selectedBuildingFloorCount ? `Макс: ${selectedBuildingFloorCount}` : "Выберите здание"}
              disabled={!formData.building_id}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Количество комнат *</label>
            <Input
              name="room_count"
              type="number"
              value={formData.room_count}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Площадь (м²) *</label>
            <Input
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              placeholder="65.5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Цена *</label>
            <Input
              name="final_price"
              value={formData.final_price}
              onChange={handleChange}
              required
              placeholder="15000000"
            />
          </div>

          {/* Koeffitsientlar - To'liq kenglikda */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {coefficientGroups.map((group) => (
              <div key={group.id} className="space-y-2">
                <label className="text-sm font-medium">Тип: {group.name}</label>
                <select
                  value={formData.bct_ids.find((id) => group.bcts.some((b) => b.id === id)) ?? ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setFormData((prev) => {
                      const filtered = prev.bct_ids.filter((id) => !group.bcts.some((b) => b.id === id));
                      return {
                        ...prev,
                        bct_ids: value ? [...filtered, value] : filtered,
                      };
                    });
                  }}
                  className="w-full h-10 border rounded px-3 bg-white disabled:opacity-50"
                  disabled={isLoadingCoefficientGroups}
                >
                  <option value="">Не выбрано</option>
                  {group.bcts.map((bct) => (
                    <option key={bct.id} value={bct.id}>
                      {bct.name} ({bct.rate})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <DialogFooter className=" flex gap-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-[#282964] text-white hover:bg-[#1f2050]"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Добавление..." : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};