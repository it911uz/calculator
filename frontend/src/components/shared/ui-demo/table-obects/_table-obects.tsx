"use client";

import React, { useCallback, useMemo } from "react";
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
import { ModalAddedComplex } from "../modals/complex-modal/modal-add-complex/_modal-add-complex";
import { ModalDeleteComplex } from "../modals/complex-modal/modal-delete-complex/_modal-delete-complex";
import Link from "next/link";
import { useComplexes } from "@/action/hooks/complex-hook/get-complexes";
import type { TableComplexProps } from "@/types/props.types";
import { IComplex } from "@/types/complex.types";
import ComplexFilters from "../filters/_comple-filter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 12;
const MAX_VISIBLE_PAGES = 5;

const TableObjects: React.FC<TableComplexProps> = ({ initialComplex }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const currentPage = Number(searchParams.get("page")) || 1;
	const searchTerm = searchParams.get("name__ilike") || "";

	const {
		data: complexData,
		isLoading,
		error,
		refetch,
	} = useComplexes({ name__ilike: searchTerm });

	const handleRefresh = useCallback(async () => {
		await refetch();
	}, [refetch]);

	const complexList = useMemo(() => {
		if (Array.isArray(complexData)) {
			return complexData as IComplex[];
		}
		return (initialComplex as IComplex[]) || [];
	}, [complexData, initialComplex]);

	const totalPages = Math.ceil(complexList.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentItems = complexList.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE,
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("page", String(newPage));
			router.push(
				`${pathname}?${params.toString()}` as __next_route_internal_types__.RouteImpl<string>,
				{ scroll: false },
			);
		},
		[pathname, router, searchParams],
	);

	const paginationPages = useMemo(() => {
		let start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
		let end = start + MAX_VISIBLE_PAGES - 1;

		if (end > totalPages) {
			end = totalPages;
			start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
		}
		return Array.from(
			{ length: Math.max(0, end - start + 1) },
			(_, i) => start + i,
		);
	}, [currentPage, totalPages]);

	if (isLoading)
		return (
			<div className="flex justify-center items-center min-h-96">
				<SpinnerDemo />
			</div>
		);

	if (error)
		return (
			<div className="text-center p-8 border rounded-md">
				<p className="text-red-500 mb-4">Ошибка загрузки данных</p>
				<button
					onClick={() => refetch()}
					className="px-4 py-2 bg-[#282964] text-white rounded-sm text-sm"
				>
					Попробовать снова
				</button>
			</div>
		);

	return (
		<section>
			<div className="flex w-full justify-between items-center pb-4 gap-4">
				<ModalAddedComplex onSuccess={handleRefresh} />

				<ComplexFilters />

				{/* Pagination UI */}
				<div className="flex items-center gap-1">
					<button
						disabled={currentPage === 1}
						onClick={() => handlePageChange(currentPage - 1)}
						className="px-2 py-1 text-gray-400 disabled:opacity-30 hover:text-[#282964] transition-colors"
					>
						‹
					</button>

					{paginationPages.map((p) => (
						<button
							key={p}
							onClick={() => handlePageChange(p)}
							className={`px-3 py-1 rounded-sm text-[12px] font-semibold transition-all
                ${p === currentPage ? "bg-[#282964] text-white" : "text-gray-600 hover:bg-gray-100"}`}
						>
							{p}
						</button>
					))}

					<button
						disabled={currentPage === totalPages || totalPages === 0}
						onClick={() => handlePageChange(currentPage + 1)}
						className="px-2 py-1 text-gray-400 disabled:opacity-30 hover:text-[#282964] transition-colors"
					>
						›
					</button>
				</div>
			</div>

			{complexList.length === 0 ? (
				<div className="text-center py-20 bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
					<ImFileEmpty size={40} className="mx-auto text-gray-300 mb-3" />
					<p className="text-gray-500 text-sm font-medium">
						Информация не найдена
					</p>
					{searchTerm && (
						<p className="text-xs text-gray-400 mt-1">
							По запросу: {searchTerm}
						</p>
					)}
				</div>
			) : (
				<div className="rounded-[3px] overflow-hidden shadow-sm border border-gray-100">
					<Table>
						<TableHeader className="bg-gray-50/50">
							<TableRow>
								<TableHead className="w-16">№</TableHead>
								<TableHead>Имя</TableHead>
								<TableHead>Описание</TableHead>
								<TableHead className="text-right">Действия</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{currentItems.map((item, i) => (
								<TableRow
									key={item.id}
									className="hover:bg-gray-50/80 transition-colors"
								>
									<TableCell className="text-gray-500">
										{startIndex + i + 1}
									</TableCell>
									<TableCell className="font-bold text-[#282964]">
										{item.name}
									</TableCell>
									<TableCell className="max-w-72 truncate text-gray-600">
										{item.description}
									</TableCell>
									<TableCell className="flex items-center space-x-2 justify-end">
										<Link
											href={`/complex/${item.id}`}
											className="p-1.5 hover:bg-white border border-transparent hover:border-gray-200 rounded-sm transition-all"
										>
											<TbExternalLink size={18} className="text-[#282964]" />
										</Link>
										<ModalDeleteComplex complexId={Number(item.id)} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			<div className="mt-4 text-[13px] text-gray-500 flex justify-between items-center">
				<p>
					Показано {complexList.length > 0 ? startIndex + 1 : 0}-
					{Math.min(startIndex + ITEMS_PER_PAGE, complexList.length)} из{" "}
					{complexList.length} комплексов
				</p>
				<button
					onClick={() => refetch()}
					className="px-4 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-sm transition-colors font-medium"
				>
					Обновить данные
				</button>
			</div>
		</section>
	);
};

export default TableObjects;
