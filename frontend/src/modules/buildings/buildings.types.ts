export interface IBuildingsState {
    buildings: IBuildings[];
    currentBuildings: IBuildings | null;
    loading: boolean;
    err: string | null;
    fetchAllBuildings: () => Promise<void>;
    fetchByIDBUildings: (buildings_id: string) => Promise<void>;
    createBuildings: (addbuildings: Partial<IBuildings>) => Promise<void>;
    removeBuildings: (buildings_id: number) => Promise<void>;
    putBuildings: (buildings_id: string, put_buildings: Partial<IBuildings>) => Promise<void>
}


export interface IBuildings {
    id: number | string;
    name: string;
    floor_count: number | string;
    base_price: string | number;
    price_unit: string;
    max_coefficient: string | number;
    complex_id: number | string
}