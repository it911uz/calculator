"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { toast } from "sonner";
import { useUpdateCoefficientType } from "@/action/hooks/coefficient-type-hook/update-coefficient-type";
import { useRouter } from "next/navigation";
import { QueryKeys } from "@/lib/query-keys";
import type { PropsModalaUpdateCoefficientTypeApartment } from "@/types/props.types";

export function ModalaUpdateCoefficientTypeApartment({
	coefficientType,
	buildingId,
	coefficientId,
}: PropsModalaUpdateCoefficientTypeApartment) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [rate, setRate] = useState("");
	const apartmentKey = QueryKeys.apartments.all;
	const { mutate, isPending } = useUpdateCoefficientType(
		buildingId,
		apartmentKey,
	);
	useEffect(() => {
		if (open) {
			setName(coefficientType.name);
			setRate(String(coefficientType.rate));
		}
	}, [open, coefficientType]);
	const router = useRouter();
	const handleSubmit = () => {
		if (!name.trim() || !rate.trim()) {
			toast.error("Заполните поля");
			return;
		}

		mutate(
			{
				id: coefficientType.id,

				data: {
					name: name.trim(),
					rate: Number(rate),
					coefficient_id: coefficientId,
				},
			},
			{
				onSuccess: () => {
					setOpen(false);
					router.refresh();
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button className="px-3 py-1 flex gap-1.5 items-center bg-gradient-to-r from-indigo-50/20 to-white border border-indigo-200 rounded-sm text-sm font-medium text-indigo-700">
					<MdEdit size={16} />
				</button>
			</DialogTrigger>

			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Редактировать коэффициент тип</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Название"
						disabled={isPending}
					/>

					<Input
						value={rate}
						onChange={(e) => setRate(e.target.value)}
						placeholder="Значение"
						disabled={isPending}
					/>

					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Отмена
						</Button>
						<Button onClick={handleSubmit} disabled={isPending}>
							Сохранить
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
