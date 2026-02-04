"use client";
import { FC, useState, useMemo } from "react";
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
import { useRouter } from "next/navigation";
import { ModalAddedBuilding } from "../modals/building-modals/modal-add-building/_modal-add-building";
import { ModalDeleteBuildings } from "../modals/building-modals/modal-delete-buildings/_modal-delete-buildings";
import type { IBuildings } from "@/types";
import ModaDataSendingForExel from "../modals/building-modals/modal-sending-for-exel/_modal-sending-for-exel";

const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;

interface TableBuildingsProps {
  buildings: IBuildings[];
}
const TableBuildings: FC<TableBuildingsProps> = ({ buildings }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(buildings.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = buildings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const pages = useMemo(() => {
    let start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const handleRefresh = () => {
    router.refresh();
  };

  if (buildings.length === 0) {
    return (
      <div className="">
        <ModalAddedBuilding onSuccess={handleRefresh} />
        <p className="text-gray-500 text-center my-4">Информация не найдена</p>
        <ImFileEmpty size={48} className="mx-auto text-gray-300" />
      </div>
    );
  }

  return (
    <section>
      <div className="flex w-full justify-between items-center pb-4">
        <ModalAddedBuilding onSuccess={handleRefresh} />

        <div className="flex items-center gap-1">
          <ModaDataSendingForExel />
          <div>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2 py-1 text-gray-400 disabled:opacity-30"
            >
              ‹
            </button>

            {pages[0] > 1 && (
              <>
                <button
                  onClick={() => setPage(1)}
                  className="px-3 py-1 text-sm"
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
                className={`px-3 py-1 rounded text-sm font-semibold
                ${
                  p === page
                    ? "bg-[#282964] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}

            {pages[pages.length - 1] < totalPages && (
              <>
                <span className="px-1 text-gray-400">…</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className="px-3 py-1 text-sm"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-2 py-1 text-gray-400 disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[3px] overflow-hidden shadow bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>ИД</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Этажи</TableHead>
              <TableHead>Базовая цена</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.map((item, i) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>{startIndex + i + 1}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.floor_count}</TableCell>
                <TableCell>{item.base_price?.toLocaleString()}</TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Link
                    href={`/buildings/${item.id}`}
                    className="p-1.5 hover:bg-gray-100 rounded"
                  >
                    <TbExternalLink size={18} />
                  </Link>
                  <ModalDeleteBuildings
                    buildingId={item.id}
                    onSuccess={handleRefresh}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
export default TableBuildings;
