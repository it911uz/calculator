import { ENV } from "@/configs/env.config";
import { getAuthData } from "@/lib/auth.util";
import { SafeResponse } from "@/types/safe-response.types";

interface BulkCreateResponseData {
  message?: string;
  count?: number;
  [key: string]: unknown;
}

type ExtendedBulkResponse = SafeResponse<BulkCreateResponseData> & { 
  success?: boolean; 
  _meta?: {
    status: number;
    error?: string;
    reason?: string;
  };
};

export async function bulkCreateApartments(
  buildingId: number | string,
  file: File
) {
  const result: {
    data: unknown;
    success: boolean;
    _meta?: {
      status: number;
      error?: string;
      reason?: string;
    };
  } = {
    data: undefined,
    success: false,
  };

  try {
    const authData = await getAuthData();
    if (!authData?.access) {
      result._meta = { status: 401, error: "Token topilmadi", reason: "TOKEN" };
      return result;
    }

    const formData = new FormData();
    formData.append("excel_file", file);

    const res = await fetch(`${ENV.PUBLIC_API_URL}/apartments/bulk-create/${buildingId}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authData.access}`,
      },
      body: formData,
    });

    const responseData: unknown = await res.json();

    if (!res.ok) {
      const errorDetail = (responseData as { detail?: string })?.detail;
      
      result._meta = {
        status: res.status,
        error: errorDetail || `Xatolik: ${res.status}`,
        reason: "HTTP",
      };
      return result;
    }

    result.data = responseData;
    result.success = true;
    result._meta = { status: res.status, reason: "HTTP" };
    return result;

  } catch (error: unknown) {
    result._meta = {
      status: 500,
      error: error instanceof Error ? error.message : "Server xatosi",
      reason: "UNKNOWN",
    };
    return result;
  }
}