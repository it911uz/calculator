import { getApartments } from '@/action/apartments.action'
import TableApartments from '@/components/shared/ui-demo/table-apartments'

export default async function ApartmentsPage() {
  const apartments = await getApartments()
  return <TableApartments initialApartments={apartments}/>
}