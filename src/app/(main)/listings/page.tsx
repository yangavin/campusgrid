'use client';

import { useContext, useState } from 'react';
import HouseCard from './HouseCard';
import House from '@/app/models';
import useSWR from 'swr';
import { db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Skeletons from '@/app/(main)/Skeletons';
import MapView from '@/app/(main)/MapView';
import { FilterContext } from '@/app/(main)/layout';

async function getListings() {
  const querySnapshot = await getDocs(collection(db, 'listings'));
  const listings = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as House;
  });
  return listings;
}

export default function Page() {
  const {
    data: listings,
    isLoading,
    error,
  } = useSWR<House[]>('listings', getListings);
  const { beds, maxPrice, source } = useContext(FilterContext);
  console.log(source);

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
      <div className="my-10">
        <MapView listings={filteredListingsWithCoordinates} />
      </div>

      <h2 className="mb-3 text-center">
        {!isLoading &&
          (filteredListings?.length ? (
            <p>{filteredListings.length} listings</p>
          ) : (
            <p>No listings found</p>
          ))}
      </h2>

      <div className="flex flex-wrap justify-center gap-4">
        {isLoading && <Skeletons />}
        {filteredListings?.map((listing) => {
          return <HouseCard key={listing.id} {...listing} />;
        })}
      </div>
    </>
  );
}
