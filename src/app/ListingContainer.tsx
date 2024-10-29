"use client";
import { useState } from "react";
import HouseCard from "./HouseCard";
import House from "./models";
import useSWR from "swr";
import { db } from "./firebase-dev";
import { collection, getDocs } from "firebase/firestore";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Skeletons from "./Skeletons";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form"
import SubletForm from "./SubletForm";


async function getListings(){
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

async function getSublets(){
  const querySnapshot = await getDocs(collection(db, "sublets"));
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

type Inputs = {
  address: string,
  price: number,
  bedsSubleased: string,
  totalBeds: string,
  baths: string,
  availableDate: Date,
  description: string,
  contact: string,
};

export default function ListingContainer({showListings}: {showListings: boolean}) {
  const { data: listings, isLoading, error } = useSWR<House[]>("listings", getListings);
  const { data: sublets, isLoading: loadingSublet, error: errorSublet } = useSWR<House[]>("sublets", getSublets);
  const [beds, setBeds] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [source, setSource] = useState<string[]>([]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  const filteredListings = listings?.filter((listing)=>{
    if(beds.length > 0 && !beds.includes(Number(listing.beds))){
      return false;
    }
    if(maxPrice && listing.price > maxPrice){
      return false;
    }
    if(source.length > 0 && !source.includes(listing.source)){
      return false;
    }
    return true;
  });
  
  const filteredSublets = sublets?.filter((listing)=>{
    if(beds.length > 0 && !beds.includes(Number(listing.beds))){
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
        {showListings && (
          <div className="flex flex-col items-center mb-10">
            <Label className="mb-3">Source</Label>
            <ToggleGroup className="flex-wrap" type="multiple" variant="outline" onValueChange={(val)=>{
              setSource(val);
            }}>
              <ToggleGroupItem value="accommodation">Accommodation Listings</ToggleGroupItem>
              <ToggleGroupItem value="axon">Axon</ToggleGroupItem>
              <ToggleGroupItem value="amberpeak">Amber Peak</ToggleGroupItem>
              <ToggleGroupItem value="frontenac">Frontenac</ToggleGroupItem>
              <ToggleGroupItem value="kijiji">Kijiji</ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
        {!showListings && (
          <div className="flex justify-center mb-10">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Post Sublet</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sublet Details</DialogTitle>
                  <SubletForm/>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}

      <h2 className="text-center mb-3">
        {filteredListings ? `${filteredListings.length} listings` : "Loading listings..."}
      </h2>

      <div className="flex flex-wrap gap-4 justify-center">
          {isLoading && <Skeletons/>}
          {error && <p>Failed to load listings</p>}
          {showListings && filteredListings?.map((listing)=>{
              return <HouseCard key={listing.id} {...listing}/>
          })}
          {!showListings && filteredSublets?.map((listing)=>{
              return <HouseCard key={listing.id} {...listing}/>
          })}
      </div>
    </>
  )
}