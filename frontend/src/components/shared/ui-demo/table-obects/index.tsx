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
import { ModalAddedComplex } from "../modals/complex-modal/modal-add-complex";
import { useComplexes } from "@/hooks/useComplex";
import { IComplex } from "@/types";
import { ModalDeleteComplex } from "../modals/complex-modal/modal-delete-complex";
import Link from "next/link";

const ITEMS_PER_PAGE = 12;
const MAX_VISIBLE_PAGES = 5;

interface TableComplexProps {
  initialComplex: IComplex[];
}

const TableObjects: React.FC<TableComplexProps> = ({ initialComplex }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const {
    data: complex = initialComplex,
    isLoading,
    error,
    refetch,
  } = useComplexes();

  const refreshData = async () => {
    await refetch();
  };

  const totalPages = Math.ceil(complex.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = complex.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPages = () => {
    let start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleViewComplex = (complexId: string | number) => {
    router.push(`/complex/${complexId}`);
  };

  const pages = getPages();

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

  if (complex.length === 0) {
    return (
      <div className="text-center">
        <div className="flex justify-start ">
          <ModalAddedComplex onSuccess={refreshData} />
        </div>
        <p className="text-gray-500 mb-4">Информация не найдена</p>
        <ImFileEmpty size={48} className="mx-auto text-gray-300" />
      </div>
    );
  }

  return (
    <section>
      <div className="flex w-full justify-between items-center pb-4">
        <ModalAddedComplex onSuccess={refreshData} />

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
              <TableHead>Имя</TableHead>
              <TableHead>Описание</TableHead>
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
                <TableCell className="max-w-[300px] truncate">
                  {item.description}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link
                    href={`/complex/${item.id}`}
                    className="inline-block p-1.5 hover:bg-gray-100 rounded transition"
                    title="Просмотр"
                  >
                    <TbExternalLink size={16} color="#282964" />
                  </Link>
                  <ModalDeleteComplex buildingId={item.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
          Показано {startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, complex.length)} из{" "}
          {complex.length} комплексов
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

export default TableObjects;
