export interface ICoefficientTypeState {
    coefficient: ICoefficientType[];
    currentCoefficient: Record<string, ICoefficientType[]> | null;
    loading: boolean;
    err: string | null;
    fetchAllCoefficientType: () => Promise<void>;
    fetchCoefficientTypeById: (coefficient_id: number) => Promise<void>;
    creteCoefficientType: (addCoefficient: Partial<ICoefficientType>) => Promise<void>;
    removeCoefficientType: (coefficient_id: number) => Promise<void>;
    putCoefficientType: (coefficient_id: number, put_coefficient: Partial<ICoefficientType>) => Promise<void>;
}
export interface ICoefficientType {
    id: number;
    name: string;
    rate: string;
    coefficient_id: number;
}