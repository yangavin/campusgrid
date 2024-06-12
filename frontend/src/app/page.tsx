import { useState, useEffect } from 'react';
import House from "./models"
import HouseCard from "./HouseCard"

async function getListings() {
  const response = await fetch('http://localhost:3001/listings');
  const data = await response.json();
  return data;
}

export default function Home() {
  const [listings, setListings] = useState<House[]>([]);

  useEffect(() => {
    getListings().then(data => setListings(data));
  }, []);

  return (
    <>
      <h1 className="text-center text-5xl my-8">Kingston House Listings</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          {listings.map((house: House) => (
            <HouseCard {...house} key={house.title}/>
          ))}
        </div>
    </>
  );
}