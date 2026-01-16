export interface IApartmentsState {
    apartment: IApartment[];
    currentApartments: IApartment | null
    loading: boolean;
    err: string | null;
    fetchAllApartments: () => Promise<void>;
    fetchByIdApartments: (apartments_id: string) => Promise<void>
    creteApartments: (addAppartments: Partial<IApartment>) => Promise<void>;
    removeApartments: (apartments_id: number) => Promise<void>;
    putApartments: (apartments_id: number, put_apartments: Partial<IApartment>) => Promise<void>
}
export interface IApartment {
    id: number | string;
    number: string;
    floor: number | string;
    area: string;
    room_count: number | string;
    final_price: string;
    building_id: number | string;
    coefficient_ids: number[] | undefined

}