import TableObects from '@/components/shared/ui-demo/table-obects';
import { BASE_URL_COMPLEX } from '@/modules/complex/complex.store';

export default async function Complex(){
  const response =  await fetch(BASE_URL_COMPLEX, {
    cache: 'no-store'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch apartments');
  }
  const complex = await response.json();
  return  <><TableObects initialComplex={complex}/></>
  
}

