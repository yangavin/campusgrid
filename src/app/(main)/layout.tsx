'use client';

import { ModeToggle } from '@/app/ThemeButton';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/app/firebase';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/app/(main)/AppSidebar';
import { useContext, createContext, useState } from 'react';
import useSWR from 'swr';
import { collection, getDocs } from 'firebase/firestore';
import House from '../models';
import { AuthProvider } from './AuthProvider';

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
  'panadew',
  'homestead',
  'tribond',
  'rentalgauge',
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [filter, setFilter] = useState<Filter>({
    beds: [],
    maxPrice: null,
    source: sourceOptions,
  });
  const {
    data: listings,
    isLoading,
    error,
  } = useSWR<House[]>('listings', getListings);
  if (error) console.log(error);

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

  return (
    <AuthProvider>
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
          <SidebarTrigger className="md:hidden" />
          <main className="flex-grow">{children}</main>
        </SidebarProvider>
      </HouseFilterContext.Provider>
    </AuthProvider>
  );
}
