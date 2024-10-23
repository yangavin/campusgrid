"use client";
import { useState } from "react";
import HouseCard from "./HouseCard";
import House from "./models";
import useSWR from "swr";
import {db} from "./firebase-dev";
import { collection, getDocs } from "firebase/firestore";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

async function getListings(): Promise<House[]> {
  const querySnapshot = await getDocs(collection(db, "listings"));
  const listings = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      image: data.image,
      address: data.address,
      price: data.price,
      link: data.link,
      beds: data.beds,
      baths: data.baths,
      availableDate: data.availableDate,
      source: data.source
    } as House;
  });
  return listings;
}

export default function ListingContainer(){
  const { data: listings, isLoading, error } = useSWR<House[]>("http://localhost:3002", getListings);
  const [beds, setBeds] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const filteredListings = listings?.filter((listing)=>{
    if(beds.length > 0 && !beds.includes(listing.beds)){
      return false;
    }
    if(maxPrice && listing.price > maxPrice){
      return false;
    }
    return true;
  })
  return (
    <>
    <div className="flex flex-col md:flex-row justify-center gap-10">
      <div className="flex flex-col items-center mb-10">
        <Label className="mb-3">Beds</Label>
        <ToggleGroup type="multiple" variant="outline" onValueChange={(val)=>{
          setBeds(val.map((v)=>parseInt(v)));
        }}>
          <ToggleGroupItem value="1">1</ToggleGroupItem>
          <ToggleGroupItem value="2">2</ToggleGroupItem>
          <ToggleGroupItem value="3">3</ToggleGroupItem>
          <ToggleGroupItem value="4">4</ToggleGroupItem>
          <ToggleGroupItem value="5">5</ToggleGroupItem>
          <ToggleGroupItem value="6">6</ToggleGroupItem>
          <ToggleGroupItem value="7">7</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-col items-center mb-10">
        <Label htmlFor="price" className="mb-3">Max Price</Label>
        <Input type="number" id="price" className="text-center w-1/2 md:w-full" onChange={({target})=>{
          setMaxPrice(parseInt(target.value));
        }}/>
      </div>
    </div>

      <div className="flex flex-wrap gap-4 justify-center">
          {isLoading && <p>Loading...</p>}
          {error && <p>Failed to load listings</p>}
          {listings && listings.length === 0 && <p>No listings found</p>}
          {filteredListings?.map((listing)=>{
              return <HouseCard key={listing.id} {...listing}/>
          })}
      </div>
    </>
  )
}