"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useComplexStore } from "@/modules/complex/complex.store";
import { TbExternalLink } from "react-icons/tb";
import { SpinnerDemo } from "../spinner-demo";
import { ImFileEmpty } from "react-icons/im";
import { useRouter } from "next/navigation";
import { ModalAddedComplex } from "../modals/complex-modal/modal-add-complex";

const ITEMS_PER_PAGE = 12;
const MAX_VISIBLE_PAGES = 5;

const TableObjects: React.FC = () => {
  const { complex, fetchAllComplex, loading, err } = useComplexStore();
const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAllComplex();
  }, [fetchAllComplex]);

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

  const handleViewComplex = (buildingId: string | number) => {
    router.push(`/complex/${buildingId}`);
  };

  const pages = getPages();

  if (!currentItems)
    return (
      <div>
        {loading && (
          <div>
            <SpinnerDemo />
          </div>
        )}

        {err && (
          <div className="text-center">
            <p>Информация не найдена</p>
            <ImFileEmpty size={30} className="mx-auto" />
          </div>
        )}
      </div>
    );
  return (
    <section>
      <div className="flex w-full justify-between items-center pb-4">
        <ModalAddedComplex/>

        <div className="flex items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-2 py-1 text-gray-400 disabled:opacity-30"
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
              className={`px-3 py-1 rounded text-[12px] font-semibold  transition
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
            className="px-2 py-1 text-gray-400 disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>ИД</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>Описание</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!loading &&
            !err &&
            currentItems.map((item, i) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {startIndex + i + 1}
                </TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleViewComplex(item.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Вид"
                  >
                    <TbExternalLink size={16} color="#282964" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      
    </section>
  );
};

export default TableObjects;
