export interface IComplexState {
    complex: IComplex[];
    currentComplex: IComplex | null;
    loading: boolean;
    err: string | null;
    fetchAllComplex: () => Promise<void>;
    fetchByIDComplex: (complex_id: string) => Promise<void>;
    createComplex: (addComplex: Partial<IComplex>) => Promise<void>;
    removeComplex: (complex_id: number) => Promise<void>;
    putComplex: (complex_id: number, put_complex: Partial<IComplex>) => Promise<void>
}


export interface IComplex {
    id: number | string;
    name: string;
    description: string;
}