"use client";
import { FC, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TbExternalLink } from "react-icons/tb";
import { SpinnerDemo } from "../spinner-demo";
import { ImFileEmpty } from "react-icons/im";
import { useRouter } from "next/navigation";
import { ModalAddedBuilding } from "../modals/building-modals/modal-add-building";
import { useBuildings, useDeleteBuilding } from "@/hooks/useBuildings";
import type { IBuildings } from "@/types";
import { toast } from "sonner";
import { ModalDeleteBuildings } from "../modals/building-modals/modal-delete-buildings";

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;

interface TableBuildingsProps {
  initialBuildings: IBuildings[];
}

const TableBuildings: FC<TableBuildingsProps> = ({
  initialBuildings,
}) => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  // TanStack Query 
  const { 
    data: buildings = initialBuildings, 
    isLoading, 
    error,
    refetch 
  } = useBuildings();

  const deleteMutation = useDeleteBuilding();

  // Delete 
  const handleDelete = async (buildingId: number) => {
    if (window.confirm("Вы уверены, что хотите удалить это здание?")) {
      try {
        await deleteMutation.mutateAsync(buildingId);
        toast.success("Здание успешно удалено");
      } catch {
        toast.error("Ошибка при удалении здания");
      }
    }
  };

  const refreshData = async () => {
    await refetch();
  };

  const totalPages = Math.ceil(buildings.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = buildings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPages = () => {
    let start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPages();

  const handleViewBuilding = (buildingId: number) => {
    router.push(`/buildings/${buildingId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <SpinnerDemo />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">Ошибка загрузки данных</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (buildings.length === 0) {
    return (
      <div className="text-center ">
        <div className="flex justify-start mb-4">
          <ModalAddedBuilding onSuccess={refreshData} />
        </div>
        <p className="text-gray-500 mb-4">Информация не найдена</p>
        <ImFileEmpty size={48} className="mx-auto text-gray-300" />
      </div>
    );
  }

  return (
    <section>
      <div className="flex w-full justify-between items-center pb-4">
        <ModalAddedBuilding onSuccess={refreshData} />

        {/* Pagination */}
        <div className="flex items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-2 py-1 text-gray-400 disabled:opacity-30 hover:text-gray-600"
          >
            ‹
          </button>

          {pages.length > 0 && pages[0] > 1 && (
            <>
              <button
                onClick={() => setPage(1)}
                className="px-3 py-1 rounded text-gray-500 hover:bg-gray-100"
              >
                1
              </button>
              <span className="px-1 text-gray-400">…</span>
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded text-[12px] font-semibold transition
                ${
                  p === page
                    ? "bg-[#282964] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {p}
            </button>
          ))}

          {pages.length > 0 && pages[pages.length - 1] < totalPages && (
            <>
              <span className="px-1 text-gray-400">…</span>
              <button
                onClick={() => setPage(totalPages)}
                className="px-3 py-1 rounded text-gray-500 hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 py-1 text-gray-400 disabled:opacity-30 hover:text-gray-600"
          >
            ›
          </button>
        </div>
      </div>

      <div className=" rounded-[3px] overflow-hidden shadow-md shadow-[#e1e2f9]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>ИД</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Количество этажей</TableHead>
              <TableHead>Базовая цена</TableHead>
              <TableHead>Цена за единицу</TableHead>
              <TableHead>Максимальный коэффициент</TableHead>
              <TableHead>Комплексный идентификатор</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.map((item, i) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {startIndex + i + 1}
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.floor_count}</TableCell>
                <TableCell>{item.base_price?.toLocaleString()}</TableCell>
                <TableCell>{item.price_unit}</TableCell>
                <TableCell>{item.max_coefficient}</TableCell>
                <TableCell>{item.complex_id}</TableCell>
                <TableCell className="text-right space-x-2 flex gap-1.5">
                  <button
                    onClick={() => handleViewBuilding(item.id as number)}
                    className="p-1 hover:bg-gray-100 rounded transition"
                    title="Просмотр"
                  >
                    <TbExternalLink size={16} color="#282964" />
                  </button>
                  <ModalDeleteBuildings 
                    buildingId={item.id}
                    onSuccess={refreshData}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
          Показано {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, buildings.length)} из {buildings.length} зданий
        </div>
        <div className="flex items-center gap-2">
          <span>Страница {page} из {totalPages}</span>
        </div>
      </div>
    </section>
  );
};

export default TableBuildings;