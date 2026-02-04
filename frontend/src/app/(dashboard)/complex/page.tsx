import { getComplexes } from '@/action/complex/get-complexes.api';
import TableObjects from '@/components/shared/ui-demo/table-obects/_table-obects';
import { IComplex } from '@/types';

export default async function Complex() {
  const buildings = await getComplexes();

  const safeBuildings = Array.isArray(buildings) ? (buildings as IComplex[]) : [];

  return (
    <>
      <TableObjects initialComplex={safeBuildings} />
    </>
  );
}

