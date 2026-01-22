// import { getSession } from 'next-auth/react';

// export async function fetcher<T>(
//   url: string,
//   options?: RequestInit
// ): Promise<T> {
//   const session = await getSession();
  
//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     ...options?.headers,
//   };

//   // Agar session va token bo'lsa, header ga qo'shamiz
//   if (session?.access_token) {
//     headers['Authorization'] = `Bearer ${session.access_token}`;
//   }

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
//     {
//       ...options,
//       headers,
//     }
//   );

//   if (!response.ok) {
//     if (response.status === 401) {
//       // Token eskirgan bo'lishi mumkin, logout qilish
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login';
//       }
//     }
    
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.message || `HTTP ${response.status}`);
//   }

//   return response.json();
// }

// // Complex API uchun misol
// export const complexApi = {
//   getAll: () => fetcher<Complex[]>('/complex'),
//   getById: (id: string) => fetcher<Complex>(`/complex/${id}`),
//   create: (data: CreateComplexDto) => 
//     fetcher<Complex>('/complex', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     }),
// };

// interface Complex {
//   id: string;
//   name: string;
//   // ... boshqa fieldlar
// }

// interface CreateComplexDto {
//   name: string;
//   // ... boshqa fieldlar
// }