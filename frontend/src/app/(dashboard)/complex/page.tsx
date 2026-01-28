import { getComplexes } from '@/api/actions/complex-action/complex.action';
import TableObects from '@/components/shared/ui-demo/table-obects';

export default async function Complex(){
  const buildings = await getComplexes()
  return  <><TableObects initialComplex={buildings}/></>
  
}

