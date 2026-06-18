"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import { uploadComplexLogo } from "@/action/complex/upload-complex-logo.api";

export function useUploadComplexLogo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, file }: { id: number; file: File }) =>
			uploadComplexLogo(id, file),

		onSuccess: (res, variables) => {
			if (res.data) {
				toast.success("Логотип успешно обновлён");
				queryClient.invalidateQueries({ queryKey: QueryKeys.complex.all });
				queryClient.invalidateQueries({
					queryKey: QueryKeys.complex.detail(variables.id),
				});
			}
		},

		onError: (error: Error) => {
			toast.error(error.message || "Не удалось загрузить логотип");
		},
	});
}
