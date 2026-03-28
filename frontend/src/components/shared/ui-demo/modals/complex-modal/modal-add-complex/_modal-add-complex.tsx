"use client";

import { useCreateComplex } from "@/action/hooks/complex-hook/create-complex";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	DialogHeader,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ModalPropsModalAddedComplex } from "@/types/props.types";
import { FC, useState } from "react";
import { toast } from "sonner";

export const ModalAddedComplex: FC<ModalPropsModalAddedComplex> = ({
	onSuccess,
}) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({ name: "", description: "" });

	const { mutateAsync: createComplex } = useCreateComplex();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			toast.error("Войдите в комплекс псевдонимов");
			return;
		}

		setLoading(true);
		try {
			await createComplex({
				name: formData.name,
				description: formData.description || "",
			});

			setFormData({ name: "", description: "" });
			setOpen(false);

			toast.success("Добавлено успешно");

			if (onSuccess) await onSuccess();
		} catch (error) {
			console.error("Ошибка добавления комплекса:", error);
			toast.error(error instanceof Error ? error.message : "Ошибка");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button className="bg-[#282964] px-2 py-1 rounded-[3px] leading-5 text-white text-sm hover:bg-[#1f2050] transition-colors">
					Добавлять комплекс +
				</button>
			</DialogTrigger>

			<DialogContent className="max-w-96">
				<DialogHeader>
					<DialogTitle>Добавлять комплекс</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-2">
						<label htmlFor="name" className="text-sm font-medium">
							Имя комплекс *
						</label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="Имя комплекс"
							value={formData.name}
							onChange={handleChange}
							required
							disabled={loading}
							className="w-full"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="description" className="text-sm font-medium">
							Описание
						</label>
						<Input
							id="description"
							name="description"
							type="text"
							placeholder="Описание"
							value={formData.description}
							onChange={handleChange}
							disabled={loading}
							className="w-full"
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={loading}
							className="mr-2"
						>
							Отмена
						</Button>
						<Button
							type="submit"
							disabled={loading || !formData.name.trim()}
							className="bg-[#282964] hover:bg-[#1f2050]"
						>
							{loading ? "Добавляется..." : "Добавлять"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
