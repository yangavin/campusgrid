"use client";
import HouseCard from "./HouseCard";
import House from "./models";
import useSWR from "swr";
import {db} from "./firebase-dev";
import { collection, getDocs } from "firebase/firestore";

async function getListings(): Promise<House[]> {
  const querySnapshot = await getDocs(collection(db, "listings"));
  const listings = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      image: data.image,
      address: data.address,
      price: data.price,
      link: data.link,
      beds: data.beds,
      baths: data.baths,
      availableDate: data.availableDate,
    } as House;
  });
  return listings;
}

export default function ListingContainer(){
  const { data: listings, isLoading, error } = useSWR<House[]>("http://localhost:3002", getListings);
  return (
    <div className="flex flex-wrap gap-4 justify-center">
        {isLoading && <p>Loading...</p>}
        {error && <p>Failed to load listings</p>}
        {listings && listings.length === 0 && <p>No listings found</p>}
        {listings && listings.length > 0 && listings.map((house: House) => (
          <HouseCard {...house} key={house.address} />
        ))}
  </div>
  )
}