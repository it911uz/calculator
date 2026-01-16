"use client";
import React, { useState } from "react"; // 🔥 useEffect olib tashlandi
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
import { IApartment } from "@/modules/apartments/apartments.types";
import { BASE_URL_APARTMENTS } from "@/modules/apartments/apartments.store";

const ITEMS_PER_PAGE = 14;
const MAX_VISIBLE_PAGES = 5;

interface TableApartmentsProps {
  initialApartments: IApartment[];
}

const TableApartments: React.FC<TableApartmentsProps> = ({ initialApartments }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [apartments, setApartments] = useState(initialApartments); 
  const [loading, setLoading] = useState(false); 

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL_APARTMENTS);
      const data = await res.json();
      setApartments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(apartments.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = apartments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const handleViewApartments = (apartmentsId: string | number) => {
    router.push(`apartments/${apartmentsId}`);
  };

  if (loading) {
    return (
      <div>
        <SpinnerDemo />
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="text-center">
        <p>Информация не найдена</p>
        <ImFileEmpty size={30} className="mx-auto" />
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
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {startIndex + i + 1}
              </TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.number}</TableCell>
              <TableCell>{item.floor}</TableCell>
              <TableCell>{item.area} м²</TableCell>
              <TableCell>{item.room_count}</TableCell>
              <TableCell>{item.final_price} ₽</TableCell>
              <TableCell>{item.building_id}</TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => handleViewApartments(item.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Просмотр"
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

export default TableApartments;