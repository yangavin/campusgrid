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
import { HouseFilterContext } from '@/app/(main)/layout';

export default function Page() {
  const filteredListings = useContext(HouseFilterContext);

  const filteredListingsWithCoordinates = filteredListings
    ? filteredListings.filter((house) => house.coordinates)
    : [];

  return (
    <>
      <MapView listings={filteredListingsWithCoordinates} />
    </>
  );
}
