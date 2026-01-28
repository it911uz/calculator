import { getComplexes } from '@/api/complex/get-complexes.api';
import TableObects from '@/components/shared/ui-demo/table-obects';

export default async function Complex(){
  const buildings = await getComplexes()
  return  <><TableObects initialComplex={buildings}/></>
  
}

