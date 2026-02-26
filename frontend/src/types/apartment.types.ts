export type TApartmentStatus = "built" | "upcomming" | "in_process";

export interface IApartment {
  id: number;
  number: string;
  floor: number;
  area: string;          
  room_count: number;
  final_price: string;  
  building_id: number;
  status: TApartmentStatus;
  bct_ids?: number[];
  block?: string
}
export interface ApartmentFormData {
  number: string;
  floor: number;
  room_count: number;
  area: string;       
  final_price: string; 
  status: TApartmentStatus;
}