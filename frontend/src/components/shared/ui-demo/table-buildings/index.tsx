"use client";
import  { FC, useState } from "react";
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
import { BASE_URL_BUILDINGS, useBuildingsStore } from "@/modules/buildings/buildings.store";
import { useRouter } from "next/navigation";
import { ModalAddedBuilding } from "../modals/building-modals/modal-add-building";
import type { IBuildings } from "@/modules/buildings/buildings.types";

const ITEMS_PER_PAGE = 12;
const MAX_VISIBLE_PAGES = 5;

type TableBuildingProps = {
  initialBuilding: IBuildings; 
};

const TableBuildings: FC<TableBuildingProps> =  ({initialBuilding}) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); 
  const [buildingss, setBuildingss] = useState(initialBuilding)
  const { buildings, err} = useBuildingsStore()
 const refreshData = async () => {
     setLoading(true);
     try {
       const res = await fetch(`${BASE_URL_BUILDINGS}/add`);
       const data = await res.json();
       console.log(data);
       
       setBuildingss(data);
     } catch (error) {
       console.error(error);
     } finally {
       setLoading(false);
     }
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

  const handleViewBuilding = (buildingId: string | number) => {
    router.push(`buildings/${buildingId}`);
  };

  if(!currentItems)return(
     <div>
        {loading && (
          <div>
            <SpinnerDemo />
          </div>
        )}

        {!buildingss && (
          <div className="text-center">
            <p>Информация не найдена</p>
            <ImFileEmpty size={30} className="mx-auto" />
          </div>
        )}
      </div>
  )

  return (
    <section>
      
      <div className="flex w-full justify-between items-center pb-4">
       <ModalAddedBuilding onSuccess={refreshData}/>

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
            <TableHead>Количество этажей</TableHead>
            <TableHead>Базовая цена</TableHead>
            <TableHead>Цена за единицу</TableHead>
            <TableHead>Максимальный коэффициент</TableHead>
            <TableHead>Комплексный идентификатор</TableHead>
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
                <TableCell>{item.floor_count}</TableCell>
                <TableCell>{item.base_price}</TableCell>
                <TableCell>{item.price_unit}</TableCell>
                <TableCell>{item.max_coefficient}</TableCell>
                <TableCell>{item.complex_id}</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleViewBuilding(item.id)}
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

export default TableBuildings;
