"use client";
import React, { useState } from "react";
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
import { ModalAddedApartments } from "../modals/apartments-modals/modal-add-apartments";
import { IApartment } from "@/types";
import { ModalDeleteApartments } from "../modals/apartments-modals/modal-delete-apartments";
import { useApartments } from "@/action/hooks/apartments-hook/get-apartments.hook";
const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;
interface TableApartmentsProps {
  initialApartments: IApartment[];
}
const TableApartments: React.FC<TableApartmentsProps> = ({
  initialApartments,
}) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  console.log(initialApartments);

  const {
    data: apartments = initialApartments,
    isLoading,
    error,
    refetch,
  } = useApartments();
  const refreshData = async () => {
    await refetch();
  };
  const totalPages = Math.ceil(apartments.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = apartments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
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
  const handleViewApartment = (apartmentId: number) => {
    console.log("Navigating to:", `/apartments/${apartmentId}`);
    router.push(`/apartments/${apartmentId}`);
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-80">
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
  if (apartments.length === 0) {
    return (
      <div className="text-center ">
        <div className="flex flex-1">
          <ModalAddedApartments onSuccess={refreshData} />
        </div>
        <p className="text-gray-500 mb-4">Информация не найдена</p>
        <ImFileEmpty size={48} className="mx-auto text-gray-300" />
      </div>
    );
  }
  return (
    <section>
      <div className="flex w-full justify-between items-center pb-4">
        <ModalAddedApartments onSuccess={refreshData} />

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

      <div className="rounded-[3px] overflow-hidden shadow-md shadow-[#e1e2f9]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>ИД</TableHead>
              <TableHead>Номер</TableHead>
              <TableHead>Этаж</TableHead>
              <TableHead>Площадь</TableHead>
              <TableHead>Комнат</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Здание</TableHead>
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
                <TableCell>{item.number}</TableCell>
                <TableCell>{item.floor}</TableCell>
                <TableCell>{item.area} м²</TableCell>
                <TableCell>{item.room_count}</TableCell>
                <TableCell>
                  {typeof item.final_price === "string"
                    ? item.final_price
                    : item.final_price}
                </TableCell>
                <TableCell>{item.building_id}</TableCell>
                <TableCell className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewApartment(item.id as number)}
                    className="p-1.5 hover:bg-gray-100 rounded transition"
                    title="Просмотр"
                  >
                    <TbExternalLink size={16} color="#282965" />
                  </button>
                  <ModalDeleteApartments
                    apartmentId={Number(item.id)}
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
          Показано {startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, apartments.length)} из{" "}
          {apartments.length} квартир
        </div>
        <div className="flex items-center gap-2">
          <span>
            Страница {page} из {totalPages}
          </span>
          <button
            onClick={refreshData}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Обновить
          </button>
        </div>
      </div>
    </section>
  );
};

export default TableApartments;