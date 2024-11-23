'use client';
import { useContext, useState } from 'react';
import HouseCard from './HouseCard';
import House, { Sublet } from '@/app/models';
import useSWR from 'swr';
import { db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Skeletons from '@/app/Skeletons';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SubletForm from '../posts/SubletForm';
import SubletCard from '../posts/SubletCard';
import MapView from '@/app/MapView';

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

export default function ListingContainer() {
  const [beds, setBeds] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [source, setSource] = useState<string[]>([]);
  const {
    data: listings,
    isLoading,
    error,
  } = useSWR<House[]>('listings', getListings);

  const filteredListings = listings?.filter((listing) => {
    if (beds.length > 0 && !beds.includes(Number(listing.beds))) {
      return false;
    }
    if (maxPrice && listing.price > maxPrice) {
      return false;
    }
    if (source.length > 0 && !source.includes(listing.source)) {
      return false;
    }
    return true;
  });
  const filteredListingsWithCoordinates = filteredListings
    ? filteredListings.filter((house) => house.coordinates)
    : [];

  return (
    <>
      <div className="flex flex-col justify-center gap-10 md:flex-row">
        <div className="mb-10 flex flex-col items-center">
          <Label className="mb-3">Beds</Label>
          <ToggleGroup
            type="multiple"
            variant="outline"
            onValueChange={(val) => {
              setBeds(val.map((v) => parseInt(v)));
            }}
          >
            <ToggleGroupItem value="1">1</ToggleGroupItem>
            <ToggleGroupItem value="2">2</ToggleGroupItem>
            <ToggleGroupItem value="3">3</ToggleGroupItem>
            <ToggleGroupItem value="4">4</ToggleGroupItem>
            <ToggleGroupItem value="5">5</ToggleGroupItem>
            <ToggleGroupItem value="6">6</ToggleGroupItem>
            <ToggleGroupItem value="7">7</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="mb-10 flex flex-col items-center">
          <Label htmlFor="price" className="mb-3">
            Max Price
          </Label>
          <Input
            type="number"
            id="price"
            className="w-1/2 text-center md:w-full"
            onChange={({ target }) => {
              setMaxPrice(parseInt(target.value));
            }}
          />
        </div>
      </div>
      <div className="mb-10 flex flex-col items-center">
        <Label className="mb-3">Source</Label>
        <ToggleGroup
          className="flex-wrap"
          type="multiple"
          variant="outline"
          onValueChange={(val) => {
            setSource(val);
          }}
        >
          <ToggleGroupItem value="accommodation">
            Accommodation Listings
          </ToggleGroupItem>
          <ToggleGroupItem value="axon">Axon</ToggleGroupItem>
          <ToggleGroupItem value="amberpeak">Amber Peak</ToggleGroupItem>
          <ToggleGroupItem value="frontenac">Frontenac</ToggleGroupItem>
          <ToggleGroupItem value="kijiji">Kijiji</ToggleGroupItem>
        </ToggleGroup>
        <div className="my-10">
          <MapView listings={filteredListingsWithCoordinates} />
        </div>
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
