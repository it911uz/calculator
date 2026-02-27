"use client";

import React, { useRef, useState, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import {
  Building as BuildingIcon,
  ChevronRight,
  CreditCard,
  
} from "lucide-react";
import { GrMoney } from "react-icons/gr";
import { ReportTemplate } from "../report-pdf/_report-pdf";
import { useApartments } from "@/action/hooks/apartments-hook/get-apartments.hook";
import { useCalculatePricing } from "@/action/hooks/calculator-hook/calculator.hook";
import { useBuildings } from "@/action/hooks/buildings-hook/get-buildings";
import { useComplexes } from "@/action/hooks/complex-hook/get-complexes";
import type {
  CalculatePricingPayload,
  CalculatePricingResponse,
  InvestmentType,
} from "@/types/calculator.types";
import type { IComplex } from "@/types/complex.types";
import type { IBuildings } from "@/types/building.types";
import type { IApartment } from "@/types/apartment.types";
import type { SafeResponse } from "@/types/safe-response.types";

const EMPTY_DATA: CalculatePricingResponse = {
  block: "-",
  floor: 0,
  area: 0,
  first_investment_rate: 0,
  first_payment_date: "",
  period_count: 0,
  old_price_per_sqrm: 0,
  new_price_per_sqrm: 0,
  old_total_price: 0,
  new_total_price: 0,
  monthly_payment: 0,
  payment_dates: [],
};

export const CalculatorClientPage: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [selectedComplexId, setSelectedComplexId] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedApartmentId, setSelectedApartmentId] = useState("");
  const [result, setResult] = useState<CalculatePricingResponse | null>(null);
  const [investmentType, setInvestmentType] =
    useState<InvestmentType>("percentage");
  const [formData, setFormData] = useState<CalculatePricingPayload>({
    first_investment_rate: 15,
    first_payment_date: "2026-02-20",
    period_count: 12,
  });

  const { data: complexesData = [] } = useComplexes();
  const { data: buildingsData = [] } = useBuildings({});
  const { data: apartmentsData = [] } = useApartments({});

  const complexes = (complexesData || []) as IComplex[];
  const buildings = (buildingsData || []) as IBuildings[];
  const apartments = (apartmentsData || []) as IApartment[];

  const buildingUnitPrice = buildings.find((b) => String(b.id) === String(selectedBuildingId))?.price_unit || 0;
  const buildingImageUrl = buildings.find((b) => String(b.id) === String(selectedBuildingId))?.image_url;
  const calculateMutation = useCalculatePricing();

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

  const filteredApartments = useMemo(() => {
    if (!selectedBuildingId) return [];
    return apartments.filter((a) => {
      const buildingId =
        typeof a.building_id === "object" && a.building_id !== null
          ? (a.building_id as { id: number | string }).id
          : a.building_id;
      return String(buildingId) === String(selectedBuildingId);
    });
  }, [apartments, selectedBuildingId]);

  const foundApartment = useMemo(() => {
    return (
      apartments.find((a) => String(a.id) === String(selectedApartmentId)) ||
      null
    );
  }, [apartments, selectedApartmentId]);

  const displayData = result ?? EMPTY_DATA;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApartmentId) return toast.error("Выберите квартиру");

    try {
      const response = await calculateMutation.mutateAsync({
        apartmentId: Number(selectedApartmentId),
        payload: formData,
        investmentType: investmentType,
      });

      const typedResponse = response as SafeResponse<CalculatePricingResponse>;
      if (typedResponse?.data) {
        setResult(typedResponse.data);
      }
    } catch (err) {
      toast.error(`Ошибка: ${err}`);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 0 }).format(val);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Расчет_Квартиra_${selectedApartmentId}`,
  });

  function formatDay(date: string): string {
    if (!date || date.length < 10) return "-";
    const day = date.slice(8, 10);
    return day.startsWith("0") ? day[1] : day;
  }

  const sliderPercentage = ((formData.period_count - 1) / (60 - 1)) * 100;

  return (
    <div className="bg-gradient-to-br from-[#d4ddff] to-[#f0f3ff] p-4 rounded-sm">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-sm shadow-md p-4 border border-[#d4ddff]">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Настройки оплаты
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Комплекс *</label>
                  <select
                    value={selectedComplexId}
                    onChange={(e) => {
                      setSelectedComplexId(e.target.value);
                      setSelectedBuildingId("");
                      setSelectedApartmentId("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#7107e7] outline-none"
                    required
                  >
                    <option value="">Выберите комплекс</option>
                    {complexes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium ">Здание</label>
                  <select
                    value={selectedBuildingId}
                    onChange={(e) => {
                      setSelectedBuildingId(e.target.value);
                      setSelectedApartmentId("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#7107e7] outline-none"
                    disabled={!selectedComplexId}
                    required
                  >
                    <option value="">Выберите здание</option>
                    {filteredBuildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                 {selectedComplexId && filteredBuildings.length === 0 && (
                    <span className="text-xs text-amber-600 font-normal italic">
                      В этом комплексе зданий не найдено
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-medium text-gray-700">
                    Квартира *
                  </label>
                  <select
                    value={selectedApartmentId}
                    onChange={(e) => setSelectedApartmentId(e.target.value)}
                    className="w-[63%] p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#7107e7] outline-none disabled:bg-gray-50"
                    disabled={!selectedBuildingId}
                    required
                  >
                    <option value="">Выберите квартиру</option>
                    {filteredApartments.map((a) => (
                      <option key={a.id} value={a.id}>
                        №{a.number} {a.block ? `(${a.block})` : ""} - {a.area}{" "}
                        м²
                      </option>
                    ))}
                  </select>
                  {selectedBuildingId && filteredApartments.length === 0 && (
                    <span className="text-xs text-amber-600 font-normal italic">
                      Квартир в этом здании не найдено.
                    </span>
                  )}
                </div>

                <div className="space-y-3 ">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Тип взноса
                      </label>
                      <select
                        value={investmentType}
                        onChange={(e) => {
                          setInvestmentType(e.target.value as InvestmentType);
                          setFormData({
                            ...formData,
                            first_investment_rate: 0,
                          });
                        }}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#7107e7] outline-none font-medium text-sm"
                      >
                        <option value="percentage">Процент (%)</option>
                        <option value="amount">Сумма ({buildingUnitPrice} )</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        {investmentType === "percentage"
                          ? "Ставка (%)"
                          : "Сумма взноса"}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.first_investment_rate || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              first_investment_rate: Number(e.target.value),
                            })
                          }
                          className="w-full p-2.5 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#7107e7] outline-none pr-12 font-bold"
                          placeholder="0"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400 text-sm font-bold">
                          {investmentType === "percentage" ? "%" : `${buildingUnitPrice}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {investmentType === "percentage" && (
                    <div className="pt-2">
                      <div className="relative w-full px-1.5">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData.first_investment_rate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              first_investment_rate: Number(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #47479f 0%, #3b82f6  ${formData.first_investment_rate}%, #e5e7eb ${formData.first_investment_rate}%, #e5e7eb 100%)`,
                          }}
                        />
                      </div>

                      <div className="relative w-full h-4 mt-1">
                        <span className="absolute left-0 text-[10px] text-gray-400 font-bold uppercase">
                          0%
                        </span>

                        <span className="absolute left-1/4 -translate-x-1/5 text-[10px] text-gray-400 font-bold uppercase">
                          25%
                        </span>

                        <span className="absolute left-1/2 -translate-x-1/3 text-[10px] text-gray-400 font-bold uppercase">
                          50%
                        </span>

                        <span className="absolute left-3/4 -translate-x-1/2 text-[10px] text-gray-400 font-bold uppercase">
                          75%
                        </span>

                        <span className="absolute right-0 text-[10px] text-gray-400 font-bold uppercase">
                          100%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Срoк рассрочки</span>
                      <span className="text-[#46479f] font-bold">
                        {formData.period_count} мес.
                      </span>
                    </div>

                    <div className="relative w-full px-1">
                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={formData.period_count}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            period_count: Number(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer relative z-10"
                        style={{
                          background: `linear-gradient(to right, #47479f 0%, #3b82f6 ${sliderPercentage}%, #e5e7eb ${sliderPercentage}%, #e5e7eb 100%)`,
                        }}
                      />
                    </div>

                    <div className="relative w-full h-4 mt-1">
                      <span className="absolute left-0 text-[10px] text-gray-400 font-bold uppercase">
                        1 мес.
                      </span>

                      <span className="absolute left-[19.6%] -translate-x-1/2 text-[10px] text-gray-400 font-bold uppercase">
                        12
                      </span>

                      <span className="absolute left-[39%] -translate-x-1/2 text-[10px] text-gray-400 font-bold uppercase">
                        24
                      </span>

                      <span className="absolute left-[59.3%] -translate-x-1/2 text-[10px] text-gray-400 font-bold uppercase">
                        36
                      </span>

                      <span className="absolute left-[78.6%] -translate-x-1/2 text-[10px] text-gray-400 font-bold uppercase">
                        48
                      </span>

                      <span className="absolute right-0 text-[10px] text-gray-400 font-bold uppercase">
                        60 мес.
                      </span>
                    </div>
                  </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Дата первого платежа
                    </label>
                    <input
                      type="date"
                      value={formData.first_payment_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          first_payment_date: e.target.value,
                        })
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-sm outline-none focus:ring-2 focus:ring-[#7107e7]"
                    />
                  </div>
                  
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={calculateMutation.isPending}
                  className="bg-gradient-to-r from-[#400189] to-[#46479f] text-white font-bold px-8 py-3 rounded-sm flex items-center disabled:opacity-50 active:scale-95 transition-all"
                >
                  {calculateMutation.isPending ? (
                    "Расчет..."
                  ) : (
                    <>
                      Рассчитать стоимость{" "}
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedComplexId("");
                    setSelectedBuildingId("");
                    setSelectedApartmentId("");
                    setResult(null);
                  }}
                  className="px-6 border border-gray-300 rounded-sm hover:bg-gray-50 font-medium"
                >
                  Сбросить
                </button>
              </div>
            </form>
          </div>

          {(foundApartment || result) && (
            <div className="bg-white rounded-sm shadow-md p-4 border border-[#d4ddff]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-[#d4ddff]">
                  <BuildingIcon className="text-[#46479f]" />
                </div>
                <h2 className="text-xl font-bold">Детали квартиры</h2>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1 text-center">
                  <span className="text-xs text-gray-500 uppercase font-bold">
                    Блок
                  </span>
                  <div className="p-2 bg-gray-50 border rounded font-bold text-lg">
                    {displayData.block}
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-xs text-gray-500 uppercase font-bold">
                    Этаж
                  </span>
                  <div className="p-2 bg-gray-50 border rounded font-bold text-lg">
                    {displayData.floor}
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-xs text-gray-500 uppercase font-bold">
                    Площадь
                  </span>
                  <div className="p-2 bg-gray-50 border rounded font-bold text-lg">
                    {displayData.area} м²
                  </div>
                </div>
              </div>
            </div>
          )}

          {displayData.new_total_price > 0 && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-sm shadow border border-blue-50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-700 text-sm">
                    Старая цена
                  </span>
                  <GrMoney className="text-blue-600" />
                </div>
                <p className="text-xl font-black text-blue-600">
                  {formatCurrency(displayData.old_total_price)}
                </p>
                <p className="text-[10px] text-gray-400">
                  {formatCurrency(displayData.old_price_per_sqrm)} / м²
                </p>
              </div>
              <div className="bg-white p-4 rounded-sm shadow border border-blue-50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-700 text-sm">
                    Новая цена
                  </span>
                  <GrMoney className="text-blue-600" />
                </div>
                <p className="text-xl font-black text-blue-600">
                  {formatCurrency(displayData.new_total_price)}
                </p>
                <p className="text-[10px] text-gray-400">
                  {formatCurrency(displayData.new_price_per_sqrm)} / м²
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#400189] to-[#46479f] rounded-sm p-8 text-white shadow-xl">
            <div className="flex justify-between mb-4">
              <span className="font-medium opacity-80 uppercase text-xs tracking-wider">
                Ежемесячный платеж
              </span>
              <CreditCard className="text-white/60" />
            </div>
            <div className="text-center mb-6">
              <p className="text-4xl font-black tracking-tight">
                {displayData.monthly_payment > 0
                  ? formatCurrency(displayData.monthly_payment)
                  : "0"}
              </p>
              <p className="text-white/60 text-[10px] uppercase font-bold mt-1">
                {buildingUnitPrice} / в месяц
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-sm text-center border border-white/5">
              <p className="text-[10px] uppercase opacity-60 font-bold">
                Число оплаты
              </p>
              <p className="text-2xl font-black">
                {displayData.payment_dates?.length > 0
                  ? formatDay(displayData.payment_dates[0])
                  : "-"}
                -число
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-sm shadow-md border border-[#d4ddff] space-y-4">
            <h3 className="font-black text-gray-800 uppercase text-sm border-b pb-2">
              Итоговая сводка
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Общая площадь:</span>
                <span className="font-bold">{displayData.area} м²</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Цена за м²:</span>
                <span className="font-bold">
                  {formatCurrency(displayData.new_price_per_sqrm)} {" "} 
                  <span className="text-[10px] text-gray-500">{buildingUnitPrice}</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Первоначальный взнос:</span>
                <span className="font-black text-[#7107e7]">
                  {investmentType === "percentage"
                    ? formatCurrency(
                        displayData.new_total_price * (formData.first_investment_rate),
                      )
                    : formatCurrency(formData.first_investment_rate)}{" "}
                     <span className="text-[10px] text-gray-500">{buildingUnitPrice}</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Сrok рассрочки:</span>
                <span className="font-bold">{formData.period_count} мес.</span>
              </div>
              <div className="flex justify-between text-xl pt-4 border-t font-black text-[#46479f]">
                <span className="uppercase text-sm self-center text-gray-800">
                  Итого:
                </span>
                <span>{formatCurrency(displayData.new_total_price)} {" "} <span className="text-[10px] text-gray-500">{buildingUnitPrice}</span></span>
                
              </div>
            </div>
          </div>

          {result && (
            <>
              <button
                onClick={handlePrint}
                className="bg-gradient-to-r from-[#400189] to-[#46479f] text-white font-bold px-8 py-3 rounded-sm flex items-center disabled:opacity-50 active:scale-95 transition-all"
              >
                Скачать PDF отчет
              </button>
              <div className="hidden">
                <ReportTemplate
                  ref={componentRef}
                  data={displayData}
                  apartmentNumber={foundApartment?.number?.toString() || ""}
                  imgUrl={buildingImageUrl}
                  priceUnit={buildingUnitPrice}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
