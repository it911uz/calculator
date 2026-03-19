import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import { SafeObject } from "@/types/safe-response.types";

export async function updateBuildingImage(
    buildingId: string | number,
    imageFile: File,
): Promise<SafeObject<{ image_url: string }>> {
    const result: SafeObject<{ image_url: string }> = { data: null };

    try {
        const auth = await getAuthData();
        if (!auth?.access) {
            result._meta = {
                status: 401,
                error: "Sessiya muddati tugagan",
                reason: "TOKEN",
            };
            return result;
        }

        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch(
            `${ENV.PUBLIC_API_URL}/buildings/${buildingId}/image/`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${auth.access}`,
                },
                body: formData,
            },
        );

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            result._meta = {
                status: res.status,
                error: errorData.detail || "Rasm yuklashda xatolik yuz berdi",
                reason: "HTTP",
            };
            return result;
        }

        result.data = await res.json();
        return result;
    } catch (error) {
        result._meta = {
            status: 500,
            error:
                error instanceof Error
                    ? error.message
                    : "Server bilan bog'lanishda xatolik",
            reason: "UNKNOWN",
        };
        return result;
    }
}
