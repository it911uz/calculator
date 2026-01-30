import { getBuildings } from '@/action/buildings/get-buildings.api';
import TableBuildings from '@/components/shared/ui-demo/table-buildings';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export default async function BuildingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) redirect("/login");
  const buildings = await getBuildings();
  return (
    <div >
      <TableBuildings 
        buildings={buildings} 
      />
    </div>
  );
}