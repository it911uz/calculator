import { create } from "zustand";
import type { IBuildings, IBuildingsState } from "./buildings.types";

export const BASE_URL_BUILDINGS = 'http://192.168.1.120:8000/buildings'

export const useBuildingsStore = create<IBuildingsState>((set, get) => ({
    buildings: [] as IBuildings[], 
    currentBuildings: null,
    loading: false,
    err: null,

    //get
    fetchAllBuildings: async () => {
        set({loading: true});
        try{
            const responseComplex = await fetch(BASE_URL_BUILDINGS);
            const data = await responseComplex.json();
            set({buildings: data, loading: false});
        } catch(errr){
            set({err: `Filed to fetch ${errr}`, loading: false})
        }
    },
    //get-by-id
    fetchByIDBUildings: async (buildings_id) => {
        set({loading: true});
        try{
            const resByIdComplex = await fetch(`${BASE_URL_BUILDINGS}/${buildings_id}`);
            if(!resByIdComplex.ok) throw new Error('Field to complex id');
            const data = await resByIdComplex.json()
            set({currentBuildings: data, loading: false});
        } catch(errr){
            set({err: `Field to Complex ${errr}`})
        }
    },
    //post
    createBuildings: async (addbuildings) => {
        try{
            const resCreteComp = await fetch(`${BASE_URL_BUILDINGS}/add`,{
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(addbuildings)
            });
            if (!resCreteComp.ok) throw new Error("Network response was not ok");

            const newbuildings = await resCreteComp.json();
            set({buildings: [...get().buildings, newbuildings]})
        } catch(errr){
            set({err: `Filed to create ${errr}`, loading: false})
        }
    },
    //delete
    removeBuildings: async (buildings_id) => {
        try{
            await fetch(`${BASE_URL_BUILDINGS}/${buildings_id}`, {
                method: "DELETE",
            });
            
            set((state) => ({
      buildings: state.buildings.filter((c) => c.id !== buildings_id),
      currentBuildings: null, 
    }));
        } catch(errr){
            set({ 
            err: `Delete failed: ${errr}`, 
            loading: false 
        });
        throw errr;
        }
    },
    //put
    putBuildings: async (buildings_id, put_buildings) => {
        try{
            const updatedComplex = await fetch(`${BASE_URL_BUILDINGS}/${buildings_id}`, {
                method: "PUT",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(put_buildings)
            });
            if (!updatedComplex.ok) throw new Error("Network response was not ok");
            const putComplex = await updatedComplex.json();
            set((state) => ({buildings: state.buildings.map((p) => p.id === buildings_id ? putComplex : p), loading: false}))
            
        } catch(errr){
            set({err: `Filed to patch ${errr}`, loading: false})
        }
    }
}))
