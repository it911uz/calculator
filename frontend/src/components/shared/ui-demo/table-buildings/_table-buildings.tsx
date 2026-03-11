"use client";
import { FC, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TbExternalLink } from "react-icons/tb";
import { ImFileEmpty } from "react-icons/im";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ModalAddedBuilding } from "../modals/building-modals/modal-add-building/_modal-add-building";
import { ModalDeleteBuildings } from "../modals/building-modals/modal-delete-buildings/_modal-delete-buildings";
import ModaDataSendingForExel from "../modals/building-modals/modal-sending-for-exel/_modal-sending-for-exel";
import type { TableBuildingsProps } from "@/types/props.types";
import BuildingsFilter from "../filters/_buildings-filter";
import { useComplexes } from "@/action/hooks/complex-hook/get-complexes";
import { useBuildings } from "@/action/hooks/buildings-hook/get-buildings"; 
import { IComplex } from "@/types/complex.types";
import { SpinnerDemo } from "../spinner-demo/_spinner-demo";

const DEFAULT_LIMIT = 10;

const TableBuildings: FC<TableBuildingsProps> = ({ buildings: initialBuildings }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allParams = useMemo(() => {
    const entries = Object.fromEntries(searchParams.entries());
    const limit = Number(entries.limit) || DEFAULT_LIMIT;
    const offset = Number(entries.offset) || 0;

    return {
      ...entries,
      page: Math.floor(offset / limit) + 1,
      limit,
      offset,
      search: entries.name__ilike || undefined,
    };
  }, [searchParams]);

  const { data: buildingsData, isLoading, refetch } = useBuildings(allParams);
  const { data: complexesData } = useComplexes();

  const complexesList = useMemo(() => {
    return Array.isArray(complexesData) ? (complexesData as IComplex[]) : [];
  }, [complexesData]);

  const displayBuildings = useMemo(() => {
    return Array.isArray(buildingsData) ? buildingsData : initialBuildings || [];
  }, [buildingsData, initialBuildings]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const currentPage = allParams.page;

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("offset", String((pageNumber - 1) * allParams.limit));
      router.push(`${pathname}?${params.toString()}` as __next_route_internal_types__.RouteImpl<string>, { scroll: false });
    },
    [pathname, router, searchParams, allParams.limit]
  );

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-2">
            <ModalAddedBuilding onSuccess={handleRefresh} />
            <ModaDataSendingForExel />
          </div>
        </div>

        <BuildingsFilter complexes={complexesList} />
      </div>

      <div className="relative rounded-[3px] overflow-hidden border border-gray-100 shadow-sm bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <SpinnerDemo />
          </div>
        )}

        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-12">№</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Этажи</TableHead>
              <TableHead>Базовая цена</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayBuildings.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-gray-400">
                  <ImFileEmpty size={32} className="mx-auto mb-2 opacity-20" />
                  <p>Информация не найдена</p>
                </TableCell>
              </TableRow>
            ) : (
              displayBuildings.map((item, i) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-gray-400">{allParams.offset + i + 1}</TableCell>
                  <TableCell className="font-bold text-[#282964]">{item.name}</TableCell>
                  <TableCell>{item.floor_count}</TableCell>
                  <TableCell className="font-semibold">{item.base_price?.toLocaleString()}</TableCell>
                  <TableCell className="flex gap-2 justify-end text-right">
                    <Link href={`/buildings/${item.id}`} className="p-1.5 hover:bg-gray-100 rounded-sm">
                      <TbExternalLink size={18} className="text-[#282964]" />
                    </Link>
                    <ModalDeleteBuildings buildingId={item.id} onSuccess={handleRefresh} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Показать по:</span>
            <select
              value={allParams.limit}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("limit", e.target.value);
                params.set("offset", "0");
                router.push(`${pathname}?${params.toString()}` as __next_route_internal_types__.RouteImpl<string>, { scroll: false });
              }}
              className="border border-gray-200 rounded px-1.5 py-1 bg-white"
            >
              {[10, 20, 50, 100].map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <p>
            Найдено: <span className="font-medium text-gray-800">{displayBuildings.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1.5 border border-gray-200 rounded-sm hover:bg-gray-50 disabled:opacity-30"
          >
            Назад
          </button>

          <span className="text-[#282964] font-medium">Страница {currentPage}</span>

          <button
            disabled={displayBuildings.length < allParams.limit}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1.5 border border-gray-200 rounded-sm hover:bg-gray-50 disabled:opacity-30"
          >
            Вперед
          </button>
        </div>
      </div>
    </section>
  );
};

export default TableBuildings;