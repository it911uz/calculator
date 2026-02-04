"use client";

import React, { useRef, useState, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import {
  Building as BuildingIcon,
  ChevronRight,
  CreditCard,
  Percent,
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
  IApartment,
  IBuildings,
  IComplex,
  SafeResponse,
} from "@/types";

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

  const [formData, setFormData] = useState<CalculatePricingPayload>({
    first_investment_rate: 12,
    first_payment_date: "2026-02-20",
    period_count: 12,
  });

  // Hooklardan kelayotgan data unknown bo'lmasligi uchun aniq cast qilamiz
  const { data: complexesData = [] } = useComplexes();
  const { data: buildingsData = [] } = useBuildings({});
  const { data: apartmentsData = [] } = useApartments();

  const complexes = (complexesData || []) as IComplex[];
  const buildings = (buildingsData || []) as IBuildings[];
  const apartments = (apartmentsData || []) as IApartment[];

  const calculateMutation = useCalculatePricing();

  const filteredBuildings = useMemo(() => {
    if (!selectedComplexId) return [];
    return buildings.filter((b) => {
      // Obyekt yoki ID ekanligini xavfsiz tekshirish
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
      });
      const typedResponse = response as SafeResponse<CalculatePricingResponse>;
      if (typedResponse && typedResponse.data) {
        setResult(typedResponse.data);
      } else if (response) {
        setResult(response as CalculatePricingResponse);
      }
    } catch (err) {
      toast.error(`Ошибка при расчете: ${err}`);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2 }).format(val);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Расчет_Квартира_${selectedApartmentId}`,
  });

  function formatDay(date: string): string {
    if (!date || date.length < 10) return "-";
    const day = date.slice(8, 10);
    return day.startsWith("0") ? day[1] : day;
  }

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
                    className="w-[63%] p-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#7107e7] outline-none"
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

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Первоначальный взнос</span>
                    <span className="text-[#7107e7] font-bold">
                      {formData.first_investment_rate}%
                    </span>
                  </div>
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
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
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
                    className="w-full p-3 border rounded outline-none"
                  />
                  
                </div>
                

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Срoк рассрочки (месяцев)</span>
                    <span className="text-[#46479f] font-bold">
                      {formData.period_count} мес.
                    </span>
                  </div>
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 мес.</span>
                    <span>12 мес.</span>
                    <span>24 мес.</span>
                    <span>36 мес.</span>
                    <span>60 мес.</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={calculateMutation.isPending}
                  className="bg-gradient-to-r from-[#400189] to-[#46479f] text-white font-semibold p-3 rounded-sm flex items-center disabled:opacity-50"
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
                  className="px-6 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
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
                <div className="space-y-1">
                  <span className="text-xs text-gray-500 uppercase">Блок</span>
                  <div className="p-2 bg-gray-50 border rounded font-semibold">
                    {displayData.block}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500 uppercase">Этаж</span>
                  <div className="p-2 bg-gray-50 border rounded font-semibold">
                    {displayData.floor}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500 uppercase">
                    Площадь
                  </span>
                  <div className="p-2 bg-gray-50 border rounded font-semibold">
                    {displayData.area} м²
                  </div>
                </div>
              </div>
            </div>
          )}

          {displayData.new_total_price > 0 && (
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-sm shadow border border-blue-50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-700">Старая цена</span>
                  <GrMoney className="text-blue-600" />
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(displayData.old_total_price)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatCurrency(displayData.old_price_per_sqrm)} / м²
                </p>
              </div>
              <div className="bg-white p-4 rounded-sm shadow border border-blue-50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-700">Новая цена</span>
                  <GrMoney className="text-blue-600" />
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(displayData.new_total_price)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatCurrency(displayData.new_price_per_sqrm)} / м²
                </p>
              </div>
              <div className="bg-white p-4 rounded-sm shadow border border-blue-50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-700">Наценка</span>
                  <Percent className="text-blue-600" />
                </div>
                <p className="text-2xl font-bold">
                  +
                  {(
                    ((displayData.new_total_price -
                      displayData.old_total_price) /
                      displayData.old_total_price) *
                    100
                  ).toFixed(2)}
                  %
                </p>
                <p className="text-xs text-gray-400">
                  +
                  {formatCurrency(
                    displayData.new_total_price - displayData.old_total_price,
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#400189] to-[#46479f] rounded-sm p-8 text-white shadow-xl">
            <div className="flex justify-between mb-4">
              <span>Ежемесячный платеж</span>
              <CreditCard className="text-white/80" />
            </div>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold">
                {displayData.monthly_payment > 0
                  ? formatCurrency(displayData.monthly_payment)
                  : "0.00"}
              </p>
              <p className="text-white/60 text-sm">в месяц</p>
            </div>
            <div className="bg-white/10 p-4 rounded text-center">
              <p className="text-xs">День оплаты</p>
              <p className="text-xl font-bold">
                {displayData.payment_dates &&
                displayData.payment_dates.length > 0
                  ? formatDay(displayData.payment_dates[0])
                  : "-"}{" "}
                - число
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-sm shadow-md border border-[#d4ddff] space-y-4">
            <h3 className="font-bold">Итоговая сводка</h3>
            <div className="flex justify-between text-sm py-2 border-b">
              <span>Площадь</span>
              <b>{displayData.area} м²</b>
            </div>
            <div className="flex justify-between text-sm py-2 border-b">
              <span>Цена за м²</span>
              <b>{formatCurrency(displayData.new_price_per_sqrm)}</b>
            </div>
            <div className="flex justify-between text-sm py-2 border-b">
              <span>Первоначальный взнос</span>
              <b className="text-[#7107e7]">
                {formatCurrency(
                  displayData.new_total_price *
                    (formData.first_investment_rate / 100),
                )}
              </b>
            </div>
            <div className="flex justify-between text-sm py-2 border-b">
              <span>Сrok рассрочки</span>
              <b>{formData.period_count} мес.</b>
            </div>
            <div className="flex justify-between text-lg pt-2 font-bold uppercase">
              <span>Итого:</span>
              <span>{formatCurrency(displayData.new_total_price)}</span>
            </div>
          </div>

          {result && (
            <>
              <button
                onClick={handlePrint}
                className="w-full bg-gradient-to-r from-[#400189] to-[#46479f] text-white font-semibold py-3 rounded-sm shadow-md active:scale-[0.98] transition-all"
              >
                Скачать PDF отчет
              </button>
              <div className="hidden">
                <ReportTemplate
                  ref={componentRef}
                  data={displayData}
                  apartmentNumber={foundApartment?.number?.toString() || ""}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
