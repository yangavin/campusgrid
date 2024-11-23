'use client';

import ListingContainer from './ListingContainer';
import { useAuth } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) router.replace('/');

  if (!user) return null;

  return (
    <div>
      <ListingContainer />
    </div>
  );
}
