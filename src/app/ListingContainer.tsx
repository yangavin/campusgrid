"use client";
import HouseCard from "./HouseCard";
import House from "./models";
import useSWR from "swr";

export default function ListingContainer(){
  const { data: listings, isLoading, error } = useSWR<House[]>("http://localhost:3002", async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  })
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