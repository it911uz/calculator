import type { CalculatePricingResponse } from "@/types/calculator.types";
import { forwardRef } from "react";

interface Props {
  data: CalculatePricingResponse;
  apartmentNumber: string;
}

export const ReportTemplate = forwardRef<HTMLDivElement, Props>(({ data, apartmentNumber }, ref) => {

 
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2 }).format(val);
  return (
   <div 
  ref={ref} 
  className="p-10 bg-white text-black w-[210mm] h-auto min-h-[297mm] mx-auto print:p-5 print:w-full"
>
      <div className="flex justify-between border-b-2 border-[#7107e7] pb-4 mb-8">
        <h1 className="text-2xl font-bold uppercase text-[#46479f]">Отчет по расчету</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">Дата: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-gray-400 uppercase text-xs font-bold mb-2">Объект</h3>
          <p className="text-lg font-semibold">Квартира №{apartmentNumber}</p>
          <p>Блок: {data.block} | Этаж: {data.floor}</p>
          <p>Площадь: {data.area} м²</p>
        </div>
        <div className="bg-[#f0f3ff] p-4 rounded-sm">
          <h3 className="text-[#46479f] uppercase text-xs font-bold mb-2">Ежемесячный платеж</h3>
          <p className="text-2xl font-black text-[#46479f]">
            {new Intl.NumberFormat("ru-RU").format(data.monthly_payment)}
          </p>
        </div>
      </div>

      <table className="w-full text-left border-collapse mb-10">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">№</th>
            <th className="p-3 border">Дата (мес.года)</th>
            <th className="p-3 border">Итого к погашению</th>
          </tr>
        </thead>
        <tbody>
         {data.payment_dates && data.payment_dates.length > 0 ? (
            data.payment_dates.map((date, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">
                  {new Date(date).toLocaleDateString("ru-RU")}
                </td>
                <td className="p-3 border text-right font-medium">
                  {formatCurrency(data.monthly_payment)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-10 text-center text-gray-400">
                График платежей пуст
              </td>
            </tr>
          )}
        </tbody>
       
      </table>
      <div className="bg-gray-50 p-2.5">
        <p className="uppercase text-xs">Итого к оплате:  {formatCurrency(data.new_total_price)} </p>
      </div>

     
    </div>
  );
});

ReportTemplate.displayName = "ReportTemplate";