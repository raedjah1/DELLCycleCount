import { redirect } from 'next/navigation';

export default function Home() {
  // For development: redirect to admin console
  // TODO: Replace with proper authentication flow
  redirect('/admin/imports/onhand');
}
