"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { useAuthMe } from "@/action/hooks/login-hook/use-auth-me";
import type { CalculatePricingResponse } from "@/types/calculator.types";

interface Props {
    data: CalculatePricingResponse;
    apartmentNumber: string;
    imgUrl?: string;
    priceUnit: number | string;
}

export const ReportTemplate = forwardRef<HTMLDivElement, Props>(
    ({ data, apartmentNumber, imgUrl, priceUnit }, ref) => {
        const { data: userData, isLoading } = useAuthMe();

        const formatCurrency = (val: number) =>
            new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2 }).format(
                val,
            );

        const specialistName =
            userData?.data?.username || (isLoading ? "..." : "Не указан");
        const specialistFullName =
            userData?.data?.fullname || (isLoading ? "..." : "Не указан");
        const specialistPhone =
            userData?.data?.phone || (isLoading ? "..." : "Не указан");

        return (
            <div
                ref={ref}
                className="px-24 py-4 bg-white text-black h-auto min-h-[297mm] mx-auto"
            >
                <div className="flex justify-between border-b-2 border-[#7107e7] items-end mb-2">
                    <h1 className="text-md font-bold uppercase text-[#46479f]">
                        Отчет по расчету
                    </h1>
                    <div className="text-right">
                        <p className="text-[9px] text-gray-500">
                            Дата: {new Date().toLocaleDateString()}
                        </p>
                        <div className="text-[10px] font-medium flex gap-2.5">
                            <p>
                                Менеджер:{" "}
                                <strong className="font-bold uppercase">
                                    {specialistFullName}
                                </strong>
                            </p>
                            <p>{specialistPhone}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-4">
                    <div>
                        <h3 className="text-gray-400 uppercase text-xs font-bold mb-2">
                            Объект
                        </h3>
                        <p className="text-lg font-semibold">
                            Квартира №{apartmentNumber}
                        </p>
                        <p className="text-sm">
                            Блок: {data.block} | Этаж: {data.floor}
                        </p>
                        <p className="text-sm">Площадь: {data.area} м²</p>
                    </div>
                    <div className="bg-[#f0f3ff] p-4 rounded-sm flex items-center justify-between">
                        <div>
                            <h3 className="text-[#46479f] uppercase text-xs font-bold mb-2">
                                Ежемесячный платеж
                            </h3>
                            <p className="text-2xl font-black text-[#46479f]">
                                {new Intl.NumberFormat("ru-RU").format(
                                    data.monthly_payment,
                                )}
                                <span className="text-[10px] text-gray-500">
                                    {priceUnit}
                                </span>
                            </p>
                        </div>

                        {imgUrl && (
                            <div className="relative w-20 h-20 ">
                                <Image
                                    fill
                                    unoptimized
                                    src={imgUrl}
                                    alt="Изображение здания"
                                    className="object-cover rounded-lg border border-gray-300 shadow-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <table className="w-full  border-collapse mb-4">
                    <thead className="">
                        <tr className="bg-gray-100">
                            <th className="py-1 border text-xs text-center px-6">
                                №
                            </th>
                            <th className="py-1 border text-xs text-center px-6">
                                Дата (мес.года)
                            </th>
                            <th className="py-1 border text-xs text-center px-6">
                                Итого к погашению
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.payment_dates && data.payment_dates.length > 0 ? (
                            data.payment_dates.map((date, index) => (
                                <tr
                                    key={index.toString()}
                                    className={
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                    }
                                >
                                    <td className="py-1 px-6 border text-[8px] text-center">
                                        {index + 1}
                                    </td>
                                    <td className="py-1 px-6 border text-[8px] text-center">
                                        {new Date(date).toLocaleDateString(
                                            "ru-RU",
                                        )}
                                    </td>
                                    <td className="py-1 px-6 border text-[8px] text-center">
                                        {formatCurrency(data.monthly_payment)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="p-10 text-center text-gray-400 text-xs"
                                >
                                    График платежей пуст
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="bg-gray-50 p-2 border-l-4 border-[#7107e7]">
                    <p className="uppercase text-xs font-bold text-[#46479f]">
                        Итого к оплате: {formatCurrency(data.new_total_price)}
                    </p>
                </div>
            </div>
        );
    },
);

ReportTemplate.displayName = "ReportTemplate";
