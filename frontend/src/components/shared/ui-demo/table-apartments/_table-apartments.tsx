"use client";
import React, { useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TbExternalLink } from "react-icons/tb";
import { SpinnerDemo } from "../spinner-demo/_spinner-demo";
import { ImFileEmpty } from "react-icons/im";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ModalAddedApartments } from "../modals/apartments-modals/modal-add-apartments/_modal-add-apartments";
import { ModalDeleteApartments } from "../modals/apartments-modals/modal-delete-apartments/_modal-delete-apartment";
import { useApartments } from "@/action/hooks/apartments-hook/get-apartments.hook";
import { TableApartmentsProps } from "@/types/props.types";
import { ApartmentFilters } from "../filters/_apartments-filter";
import { useBuildings } from "@/action/hooks/buildings-hook/get-buildings";

const DEFAULT_LIMIT = 15; 

const TableApartments: React.FC<TableApartmentsProps> = ({ initialApartments }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allParams = useMemo(() => {
    const entries = Object.fromEntries(searchParams.entries());
    return {
      ...entries,
      limit: Number(entries.limit) || DEFAULT_LIMIT,
      offset: Number(entries.offset) || 0,
    };
  }, [searchParams]);

  const { data: buildingsData = [] } = useBuildings();
  const { data: apartmentsData, isLoading, refetch } = useApartments(allParams);

  const refreshData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const limit = allParams.limit;
  const offset = allParams.offset;
  const currentPage = Math.floor(offset / limit) + 1;

  const apartments = Array.isArray(apartmentsData) ? apartmentsData : initialApartments || [];

  const handlePageChange = useCallback((pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const newOffset = (pageNumber - 1) * limit;
    
    params.set("offset", String(newOffset));
    params.set("limit", String(limit));
    
    router.push(`${pathname}?${params.toString()}` as __next_route_internal_types__.RouteImpl<string>, { scroll: false });
  }, [pathname, router, searchParams, limit]);

  if (isLoading) return <div className="flex justify-center items-center min-h-80"><SpinnerDemo /></div>;

  
 
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <ModalAddedApartments onSuccess={refreshData} />
      </div>
      
      <ApartmentFilters buildings={buildingsData} />

      <div className="rounded-[3px] overflow-hidden border border-gray-100 shadow-sm bg-white mt-4">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-12">№</TableHead>
              <TableHead>Номер</TableHead>
              <TableHead>Этаж</TableHead>
              <TableHead>Площадь</TableHead>
              <TableHead>Комнат</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 py-10">
                    <ImFileEmpty size={48} className="text-gray-200" />
                    <p className="text-gray-500 font-medium">Информация не найдена</p>
                    <p className="text-xs text-gray-400">Попробуйте изменить параметры фильтра</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              apartments.map((item, i) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="text-gray-400">{offset + i + 1}</TableCell>
                  <TableCell className="font-bold text-[#282964]">{item.number}</TableCell>
                  <TableCell>{item.floor}</TableCell>
                  <TableCell>{item.area} м²</TableCell>
                  <TableCell>{item.room_count}</TableCell>
                  <TableCell className="font-semibold">
                    {Number(item.final_price).toLocaleString()}
                  </TableCell>
                  <TableCell className="flex justify-end items-center gap-2">
                    <button onClick={() => router.push(`/apartments/${item.id}`)} className="p-1.5 hover:bg-gray-100 rounded-sm">
                      <TbExternalLink size={18} className="text-[#282964]" />
                    </button>
                    <ModalDeleteApartments apartmentId={Number(item.id)} onSuccess={refreshData} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination qismi */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-gray-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Показать по:</span>
            <select 
              value={limit}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("limit", e.target.value);
                params.set("offset", "0"); 
                router.push(`${pathname}?${params.toString()}` as __next_route_internal_types__.RouteImpl<string>);
              }}
              className="border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              {[10, 15, 25, 50, 100].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <span>|</span>
          <p>
            Показано <span className="font-semibold text-gray-700">{offset + 1} - {offset + apartments.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            disabled={offset === 0}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 border border-gray-200 rounded-sm hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            Назад
          </button>
          <span className="font-medium text-[#282964] px-2">
            Страница {currentPage}
          </span>
          <button 
            disabled={apartments.length < limit}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 border border-gray-200 rounded-sm hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            Вперед
          </button>
        </div>
      </div>
    </section>
  );
};

export default TableApartments;