import TableApartments from '@/components/shared/ui-demo/table-apartments'
import { BASE_URL_APARTMENTS } from '@/modules/apartments/apartments.store';

export default async function ApartmentsPage() {
  const response = await fetch(BASE_URL_APARTMENTS, {
    cache: 'no-store' 
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch apartments');
  }
  
  const apartments = await response.json();

  return <TableApartments initialApartments={apartments} />
}