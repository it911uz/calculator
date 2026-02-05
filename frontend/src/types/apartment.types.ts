export interface IApartment {
  id: number;
  number: string;
  floor: number;
  area: string;          
  room_count: number;
  final_price: string;  
  building_id: number;
  bct_ids?: number[];
  block?: string
}
export interface ApartmentFormData {
  number: string;
  floor: number;
  room_count: number;
  area: string;       
  final_price: string; 
}