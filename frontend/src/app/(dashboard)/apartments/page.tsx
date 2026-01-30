import { getApartments } from '@/action/apartaments/get-apartaments.api'
import TableApartments from '@/components/shared/ui-demo/table-apartments'

export default async function ApartmentsPage() {
  const apartments = await getApartments()
  return <TableApartments initialApartments={apartments}/>
}