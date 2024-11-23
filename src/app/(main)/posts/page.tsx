'use client';
import { useContext, useState } from 'react';
import { Sublet } from '@/app/models';
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
import SubletForm from './SubletForm';
import SubletCard from './SubletCard';
import MapView from '@/app/MapView';
import useSWR from 'swr';

type Inputs = {
  address: string;
  price: number;
  bedsSubleased: string;
  totalBeds: string;
  baths: string;
  availableDate: Date;
  description: string;
  contact: string;
};

async function getSublets() {
  const querySnapshot = await getDocs(collection(db, 'sublets'));
  const listings = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      poster: data.poster,
      photos: data.photos,
      address: data.address,
      price: data.price,
      description: data.description,
      bedsSubleased: data.bedsSubleased,
      bedsTotal: data.bedsTotal,
      baths: data.baths,
      availableDate: data.availableDate.toDate(),
      endDate: data.endDate.toDate(),
      contact: data.contact,
    } as Sublet;
  });
  return listings;
}

export default function Page() {
  const [refetchToggle, setRefetchToggle] = useState(false);
  const {
    data: sublets,
    isLoading,
    error: errorSublet,
  } = useSWR<Sublet[]>(String(refetchToggle), getSublets);
  const [beds, setBeds] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSublets = sublets?.filter((listing) => {
    if (beds.length > 0 && !beds.includes(Number(listing.bedsSubleased))) {
      return false;
    }
    if (maxPrice && listing.price > maxPrice) {
      return false;
    }
    return true;
  });

  return (
    <div>
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
      <div className="mb-10 flex justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Post Sublet</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sublet Details</DialogTitle>
              <SubletForm
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                closeDialog={() => setIsDialogOpen(false)}
                refetch={() => setRefetchToggle(!refetchToggle)}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <h2 className="mb-3 text-center">
        {!isLoading &&
          (filteredSublets?.length ? (
            <p>{filteredSublets.length} listings</p>
          ) : (
            <p>No listings found</p>
          ))}
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {isLoading && <Skeletons />}
        {filteredSublets?.map((listing) => {
          return (
            <SubletCard
              key={listing.id}
              {...listing}
              refetch={() => setRefetchToggle(!refetchToggle)}
            />
          );
        })}
      </div>
    </div>
  );
}
