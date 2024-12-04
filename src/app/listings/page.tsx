'use client';

import { db } from '@/app/firebase';
import { useState } from 'react';
import useSWR from 'swr';
import { collection, getDocs } from 'firebase/firestore';
import House from '../models';
import MapView from './(map)/MapView';
import AppSidebar from './(sidebar)/AppSidebar';

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
  'limestone',
  'heron',
];

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

export default function Page() {
  const [beds, setBeds] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [source, setSource] = useState<string[]>(sourceOptions);

  const {
    data: listings,
    isLoading,
    error,
  } = useSWR<House[]>('listings', getListings);
  if (error) console.log(error);

  const [hoveringId, setHoveringId] = useState<string | null>(null);

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

  const filteredListingsWithCoordinates = filteredListings
    ? filteredListings.filter((house) => house.coordinates)
    : [];

  return (
    <>
      <AppSidebar
        beds={beds}
        maxPrice={maxPrice}
        source={source}
        setBeds={setBeds}
        setMaxPrice={setMaxPrice}
        setSource={setSource}
        filteredListings={filteredListings || []}
        isLoading={isLoading}
        sourceOptions={sourceOptions}
        setHoveringId={setHoveringId}
      />
      <MapView
        listings={filteredListingsWithCoordinates}
        hoveringId={hoveringId}
      />
    </>
  );
}
