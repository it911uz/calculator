"use client";

import { Loader2 } from "lucide-react";
import { useUpdateApartment } from "@/action/hooks/apartments-hook/update-apartment.hook";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { IApartment, TApartmentStatus } from "@/types/apartment.types";

interface StatusUpdateCellProps {
    apartment: IApartment;
}

const statusConfig: Record<
    TApartmentStatus,
    { label: string; className: string }
> = {
    built: { label: "Построен", className: "bg-green-200 text-gray-800" },
    upcoming: { label: "Скоро будет", className: "bg-gray-300 text-gray-800" },
    in_process: { label: "В процессе", className: "bg-blue-300 text-gray-800" },
};

export const StatusUpdateCell: React.FC<StatusUpdateCellProps> = ({
    apartment,
}) => {
    const { mutate: updateStatus, isPending } = useUpdateApartment();

    const handleStatusChange = (newStatus: string) => {
        updateStatus({
            id: apartment.id,
            data: {
                status: newStatus as TApartmentStatus,
                building_id: apartment.building_id,
                bct_ids: apartment.bct_ids || [],
            },
        });
    };

    return (
        <Select
            defaultValue={apartment.status}
            onValueChange={handleStatusChange}
            disabled={isPending}
        >
            <SelectTrigger
                className={`h-6 w-32 border-none shadow-none focus:ring-0 px-3 py-1 rounded-md text-sm font-medium ${
                    statusConfig[apartment.status as TApartmentStatus]
                        ?.className
                }`}
            >
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                    <SelectValue />
                )}
            </SelectTrigger>
            <SelectContent>
                {(Object.keys(statusConfig) as TApartmentStatus[]).map(
                    (status) => (
                        <SelectItem key={status} value={status}>
                            {statusConfig[status].label}
                        </SelectItem>
                    ),
                )}
            </SelectContent>
        </Select>
    );
};
