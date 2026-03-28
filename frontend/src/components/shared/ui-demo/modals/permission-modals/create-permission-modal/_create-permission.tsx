"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2, ShieldCheck } from "lucide-react";
import { usePostPermission } from "@/action/hooks/permissions-hook/use-post-permission-hook";

const CreatePermissionsManagement: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [codename, setCodename] = useState<string>("");

	const { mutate: createPermission, isPending } = usePostPermission();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!codename.trim()) return;

		createPermission(
			{ codename: codename.trim().toLowerCase().replace(/\s+/g, "_") },
			{
				onSuccess: (res) => {
					if (!res._meta) {
						setOpen(false);
						setCodename("");
					}
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-indigo-900 hover:bg-indigo-800 text-white gap-2 ">
					<PlusCircle size={14} />
					<span>Создать разрешение</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<ShieldCheck className="text-indigo-900" size={20} />
						Новое разрешение
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-2">
					<div className="space-y-2">
						<label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
							Cистемное имя
						</label>
						<Input
							required
							placeholder="Напр: create_users"
							value={codename}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setCodename(e.target.value)
							}
							disabled={isPending}
							className="lowercase"
						/>
						<p className="text-[10px] text-muted-foreground italic">
							* Используйте нижнее подчеркивание вместо пробелов
						</p>
					</div>

					<DialogFooter className="pt-2 space-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isPending}
							className="flex-1"
						>
							Отмена
						</Button>
						<Button
							type="submit"
							disabled={isPending || !codename.trim()}
							className="bg-indigo-900 hover:bg-indigo-800 text-white flex-1"
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Создать"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreatePermissionsManagement;
