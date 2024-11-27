'use client';

import { useContext } from 'react';
import MapView from '@/app/(main)/MapView';
import { HouseFilterContext, HoveringIdContext } from '@/app/(main)/layout';

export default function Page() {
  const filteredListings = useContext(HouseFilterContext);
  const hoveringId = useContext(HoveringIdContext);

  const filteredListingsWithCoordinates = filteredListings
    ? filteredListings.filter((house) => house.coordinates)
    : [];

  return (
    <>
      <MapView
        listings={filteredListingsWithCoordinates}
        hoveringId={hoveringId}
      />
    </>
  );
}
