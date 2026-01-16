import { create } from "zustand";
import { ICoefficientType, ICoefficientTypeState } from "./coefficients-types.types";
const BASE_URL_COEFFICIENT = "http://192.168.1.120:8000/coefficient-types"


export const useCoefficientTypeStore = create<ICoefficientTypeState>((set, get) => ({
    coefficient: [] as ICoefficientType[],
    currentCoefficient: null,
    loading: false,
    err: null,
    
    //get-by-id
    fetchCoefficientTypeById: async (coefficient_id) => {
        set({loading: true});
        try{
            const resByIdCoefficent = await fetch(`${BASE_URL_COEFFICIENT}/by-building-id/${coefficient_id}`);
            if(!resByIdCoefficent.ok) throw new Error("Failed to fetch coefficient")
            const data = await resByIdCoefficent.json();
            set({currentCoefficient: data, loading: false})
        } catch(errr){
            set({ err: `Failed to fetch by id: ${errr}`, loading: false });
        }
    },
    //get
    fetchAllCoefficientType: async () => {
        set({loading: true});
        try{
            const responseCoefficient = await fetch(BASE_URL_COEFFICIENT);
            const data = await responseCoefficient.json();
            set({coefficient: data, loading: false})
        } catch(errr){
            set({err: `Filed to fetch ${errr}`, loading: false})
        }
    },
    //post
    creteCoefficientType: async (addCoefficient) => {
        try{
            const resCreteCoeifficient = await fetch(`${BASE_URL_COEFFICIENT}/add`, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(addCoefficient)
            });
            if(!resCreteCoeifficient.ok) throw new Error("Network response was not ok");
            const newCoefficient = await resCreteCoeifficient.json();
            set({coefficient: [...get().coefficient, newCoefficient]});
        } catch(errr){
            set({err: `Filed to create ${errr}`, loading: false})
        }
    },
    //delete
    removeCoefficientType: async (coefficient_id) => {
        try{
            await fetch(`${BASE_URL_COEFFICIENT}/${coefficient_id}`, {
                method: "DELETE"
            });
            set({coefficient: get().coefficient.filter((c) => c.id !== coefficient_id)})
        } catch(errr){
            set({err: `Filed ${errr}`, loading: false})
        }
    },
    //put
    putCoefficientType: async (coefficient_id, put_coefficient,) => {
        try{
            const resPutCoefficient = await fetch(`${BASE_URL_COEFFICIENT}/${coefficient_id}`, {
                method: "PUT",
                headers: {"Content-Type" : "application/json"},
                body:JSON.stringify(put_coefficient)
            });
            if(!resPutCoefficient.ok) throw new Error("Network response was not ok");
            const putCoefficient = await resPutCoefficient.json()
            set((state) => ({coefficient: state.coefficient.map((c) => c.id === coefficient_id ? putCoefficient : c)}))
        } catch(errr){
            set({err: `Filed to patch ${errr}`, loading: false})

        }
    }
}))