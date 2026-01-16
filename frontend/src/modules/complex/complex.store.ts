import { create } from "zustand";
import type { IComplex, IComplexState } from "./complex.types";

export const BASE_URL_COMPLEX = 'http://192.168.1.120:8000/complexes'

export const useComplexStore = create<IComplexState>((set, get) => ({
    complex: [] as IComplex[], 
    currentComplex: null,
    loading: false,
    err: null,

    //get
    fetchAllComplex: async () => {
        set({loading: true});
        try{
            const responseComplex = await fetch(BASE_URL_COMPLEX);
            const data = await responseComplex.json();
            set({complex: data, loading: false});
        } catch(errr){
            set({err: `Filed to fetch ${errr}`, loading: false})
        }
    },
    //get-by-id
    fetchByIDComplex: async (complex_id) => {
        set({loading: true});
        try{
            const resByIdComplex = await fetch(`${BASE_URL_COMPLEX}/${complex_id}`);
            if(!resByIdComplex.ok) throw new Error('Field to complex id');
            const data = await resByIdComplex.json()
            set({currentComplex: data, loading: false});
        } catch(errr){
            set({err: `Field to Complex ${errr}`})
        }
    },
    //post
    createComplex: async (addComplex) => {
        try{
            const resCreteComp = await fetch(`${BASE_URL_COMPLEX}/add`,{
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(addComplex)
            });
            if (!resCreteComp.ok) throw new Error("Network response was not ok");

            const newComplex = await resCreteComp.json();
            set({complex: [...get().complex, newComplex]})
        } catch(errr){
            set({err: `Filed to create ${errr}`, loading: false})
        }
    },
    //delete
    removeComplex: async (complex_id) => {
        try{
            await fetch(`${BASE_URL_COMPLEX}/${complex_id}`, {
                method: "DELETE",
            });
            
            set({complex: get().complex.filter((c) => c.id !== complex_id)})
        } catch(errr){
            set({err: `Field ${errr}`, loading: false})
        }
    },
    //put
    putComplex: async (complex_id, put_complex) => {
        try{
            const updatedComplex = await fetch(`${BASE_URL_COMPLEX}/${complex_id}`, {
                method: "PUT",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(put_complex)
            });
            if (!updatedComplex.ok) throw new Error("Network response was not ok");
            const putComplex = await updatedComplex.json();
            set((state) => ({complex: state.complex.map((p) => p.id === complex_id ? putComplex : p), loading: false}))
            
        } catch(errr){
            set({err: `Filed to patch ${errr}`, loading: false})
        }
    }
}))
