export interface ICoefficientState {
    coefficient: ICoefficient[];
    currentCoefficient: ICoefficient | null;
    loading: boolean;
    err: string | null;
    fetchAllCoefficient: () => Promise<void>;
    fetchCoefficientById: (coefficient_id: number) => Promise<void>;
    creteCoefficient: (addCoefficient: Partial<ICoefficient>) => Promise<void>;
    removeCoefficient: (coefficient_id: number) => Promise<void>;
    putCoefficient: (coefficient_id: number, put_coefficient: Partial<ICoefficient>) => Promise<void>
}
export interface ICoefficient {
    id: number;
    name: string;
    building_id: number 
}