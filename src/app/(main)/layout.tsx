'use client';

import { ModeToggle } from '@/app/ThemeButton';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/app/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthProvider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/app/(main)/AppSidebar';
import { useContext, createContext, useState } from 'react';
import useSWR from 'swr';
import { collection, getDocs } from 'firebase/firestore';
import House from '../models';

interface Filter {
  beds: number[];
  maxPrice: number | null;
  source: string[];
}

export const HouseFilterContext = createContext<House[]>([]);

async function getListings() {
  const querySnapshot = await getDocs(collection(db, 'listings'));
  const listings = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as House;
  });
  listings.forEach((listing) => {
    if (listing.source === 'frontenac') {
      listing.image = '/frontenac.png';
    }
  });
  return listings;
}

const sourceOptions = [
  'accommodation',
  'axon',
  'amberpeak',
  'frontenac',
  'kijiji',
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [filter, setFilter] = useState<Filter>({
    beds: [],
    maxPrice: null,
    source: sourceOptions,
  });
  const router = useRouter();
  const {
    data: listings,
    isLoading,
    error,
  } = useSWR<House[]>('listings', getListings);

  function signOut() {
    auth.signOut();
    router.replace('/');
  }
  function setBeds(beds: number[]) {
    setFilter({ ...filter, beds });
  }
  function setMaxPrice(maxPrice: number | null) {
    setFilter({ ...filter, maxPrice });
  }
  function setSource(source: string[]) {
    setFilter({ ...filter, source });
  }

  const { beds, maxPrice, source } = filter;
  const filteredListings = listings?.filter((listing) => {
    if (beds.length > 0 && !beds.includes(Number(listing.beds))) {
      return false;
    }
    if (maxPrice && listing.price > maxPrice) {
      return false;
    }
    if (!source.includes(listing.source)) {
      return false;
    }
    return true;
  });

  const { user } = useAuth();
  if (!user) router.replace('/');
  if (!user) return null;

  return (
    <HouseFilterContext.Provider value={filteredListings || []}>
      <SidebarProvider>
        <AppSidebar
          {...filter}
          setBeds={setBeds}
          setMaxPrice={setMaxPrice}
          setSource={setSource}
          filteredListings={filteredListings || []}
          isLoading={isLoading}
          sourceOptions={sourceOptions}
        />
        <main className="flex-grow">{children}</main>
      </SidebarProvider>
    </HouseFilterContext.Provider>
  );
}
