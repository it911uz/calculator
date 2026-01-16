import { create } from "zustand";
import type { IApartment, IApartmentsState } from "./apartments.types";
const BASE_URL_APARTMENTS = 'http://192.168.1.120:8000/apartments'
export const useApartmentsStore = create<IApartmentsState>((set, get) => ({
    apartment: [] as IApartment[],
    currentApartments:null,
    loading: false,
    err: null,
    //get
    fetchAllApartments: async () => {
        set({loading: true});
        try{
            const responseApartments = await fetch(BASE_URL_APARTMENTS);
            const data = await responseApartments.json();
            set({apartment: data, loading: false});
        } catch(errr){
            set({err: `Filed to fetch ${errr}`, loading: false})
        }
    },
    //by-id
    fetchByIdApartments: async (apartments_id) => {
        set({loading: true});
        try{
            const resByIdComplex = await fetch(`${BASE_URL_APARTMENTS}/${apartments_id}`);
            if(!resByIdComplex.ok) throw new Error('Field to complex id');
            const data = await resByIdComplex.json()
            set({currentApartments: data, loading: false});
            
        } catch(errr){
            set({currentApartments: null, err: String(errr), loading: false});
        }
    },
    //post
    creteApartments: async (addAppartments) => {
        try{
            const resCreteApart = await fetch(`${BASE_URL_APARTMENTS}/add`, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(addAppartments)
            });
            if(!resCreteApart.ok) throw new Error("Network response was not ok");
            const newApartments = await resCreteApart.json();
            set({apartment: [...get().apartment, newApartments]})
        } catch(errr){
            set({err: `Filed to create ${errr}`, loading: false})
        }
    },
    //delete
     removeApartments: async (apartments_id) => {
        set({loading: true});
        try{
            await fetch(`${BASE_URL_APARTMENTS}/${apartments_id}`, {
                method: "DELETE",
            });
            set((state) => ({ 
                apartment: state.apartment.filter((a) => a.id !== apartments_id),
                currentApartments: null, 
                loading: false 
            }));
        } catch(errr){
            set({err: `Delete failed: ${errr}`, loading: false});
            throw errr;
        }
    },
    //put
    putApartments: async (apartments_id, put_apartments) => {
        try{
            const resPutApart = await fetch(`${BASE_URL_APARTMENTS}/${apartments_id}`, {
                method: "PUT",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(put_apartments)
            });
            if(!resPutApart.ok) throw new Error("Network response was not ok");
            const putAppartment = await resPutApart.json()
            set((state) => ({apartment: state.apartment.map((a) => a.id === apartments_id ? putAppartment : a)}))
        } catch(errr){
            set({err: `Filed to patch ${errr}`, loading: false})
        }
    },
}))