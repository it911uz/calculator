import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import { updateBuildingImage } from "@/action/buildings/patch-img.api";

export function useUpdateBuildingImage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, file }: { id: string | number; file: File }) =>
			updateBuildingImage(id, file),

		onSuccess: (res, variables) => {
			if (res.data) {
				toast.success("Изображение успешно обновлено");
				queryClient.invalidateQueries({
					queryKey: QueryKeys.buildings.all,
				});
				queryClient.invalidateQueries({
					queryKey: QueryKeys.buildings.detail(variables.id),
				});
			}
		},

		onError: (error: Error) => {
			toast.error(error.message || "Не удалось загрузить изображение");
		},
	});
}
