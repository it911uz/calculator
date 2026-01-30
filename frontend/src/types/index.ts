import { CSSProperties } from "react";

// Apartments types
export interface IApartment {
  id: number;
  number: string;
  floor: number;
  area: string;          
  room_count: number;
  final_price: string;  
  building_id: number;
  bct_ids?: number[];
}
export interface ApartmentFormData {
  number: string;
  floor: number;
  room_count: number;
  area: string;       
  final_price: string; 
}


// Buildings types
export interface IBuildings {
  id: number | string;
  name: string;
  floor_count: number | string;
  price_unit: string;
  max_coefficient: number 
  base_price: string | number;
  complex_id: number | string;
}

// Complex types
export interface IComplex {
  id: number;
  name: string;
  description: string;
}

// Coefficient types
export interface ICoefficient {
  id: number;
  name: string;
  building_id: number | string;
}
// Coefficient Type
export interface ICoefficientType {
  id: number;
  name: string;
  rate: number;
  coefficient_id: number;
  bcts: number[];
  building_id: number; 
}
export type UpdateCoefficientTypePayload = {
  name: string;
  rate: string | number;
  coefficient_id: number; 
};
// Group (API dan keladi)
export interface ICoefficientTypeGroup {
  id: number;
  name: string;
  bcts: ICoefficientType[];
}
// Coefficient Type types
export type LoginFormData = {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
};

export interface LottieAnimationProps {
  animationData: null | object;
  className?: string;
  style?: CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
  width?: number | string;
  height?: number | string;
  speed?: number;
  onComplete?: () => void;
}
export type CreateCoefficientTypePayload = {
  name: string;
  rate: number;
  building_id: number;
  coefficient_id: number;
};

export type CreateCoefficientPayload = {
  name: string;
  building_id: number;
};

export interface FastApiValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface FastApiErrorResponse {
  detail: string | FastApiValidationErrorItem[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
}

export interface LoginPayload {
  username: string;
  password: string;
}
export interface UpdateArgs {
  id: number | string;
  data: Partial<IApartment>;
}
 export interface UpdateBuildingArgs {
  id: string | number;
  data: Partial<IBuildings>;
}

//--------------------------------------------
export type TMetaReason = "TOKEN" | "HTTP" | "PARSE" | "UNKNOWN";

export interface IMetaInfo {
  status?: number;
  error?: string;
  reason?: TMetaReason;
}

export interface SafeObject<T> {
  data: T | null;
  _meta?: IMetaInfo;
}
export interface SafeDelete {
  success: boolean;
  _meta?: IMetaInfo;
}
export type SafeArray<T> = T[] & {
  _meta?: IMetaInfo;
};
export interface SafeArrayGetCoefficient<T> {
  data: T[];
  _meta?: IMetaInfo;
}
export type ComplexArray<T = unknown> = T[] & {
  _meta?: IMetaInfo;
};
//--------------------------------------------
// Query keys types
export const QueryKeys = {
  apartments: {
    all: ['apartments'] as const,
    lists: () => [...QueryKeys.apartments.all, 'list'] as const,
    list: (filters: string) => [...QueryKeys.apartments.lists(), { filters }] as const,
    details: () => [...QueryKeys.apartments.all, 'detail'] as const,
    detail: (id: string | number) => [...QueryKeys.apartments.details(), id] as const,
  },
  buildings: {
    all: ['buildings'] as const,
    lists: () => [...QueryKeys.buildings.all, 'list'] as const,
    list: (filters: string) => [...QueryKeys.buildings.lists(), { filters }] as const,
    details: () => [...QueryKeys.buildings.all, 'detail'] as const,
    detail: (id: string | number) => [...QueryKeys.buildings.details(), id] as const,
  },
  complex: {
    all: ['complex'] as const,
    lists: () => [...QueryKeys.complex.all, 'list'] as const,
    list: (filters: string) => [...QueryKeys.complex.lists(), { filters }] as const,
    details: () => [...QueryKeys.complex.all, 'detail'] as const,
    detail: (id: string | number) => [...QueryKeys.complex.details(), id] as const,
  },
  coefficients: {
    all: ['coefficients'] as const,
    lists: () => [...QueryKeys.coefficients.all, 'list'] as const,
    list: (filters: string) => [...QueryKeys.coefficients.lists(), { filters }] as const,
    details: () => [...QueryKeys.coefficients.all, 'detail'] as const,
    detail: (id: string | number) => [...QueryKeys.coefficients.details(), id] as const,
  },
  coefficientTypes: {
    all: ['coefficientTypes'] as const,
    lists: () => [...QueryKeys.coefficientTypes.all, 'list'] as const,
    list: (filters: string) => [...QueryKeys.coefficientTypes.lists(), { filters }] as const,
    details: () => [...QueryKeys.coefficientTypes.all, 'detail'] as const,
    detail: (id: string | number) => [...QueryKeys.coefficientTypes.details(), id] as const,
    byBuilding: (buildingId: number) => [...QueryKeys.coefficientTypes.all, 'building', buildingId] as const,
  },
};