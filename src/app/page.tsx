"use client";

import { useEffect, useState } from "react";
import HouseCard from "./HouseCard";
import House from "./models";

export default function Home() {
  const [listings, setListings] = useState<House[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://guarded-garden-90378-97fa86afe265.herokuapp.com/listings");
      const data = await response.json();
      setListings(data);
    }

    fetchData(); // Fetch data when the component mounts (on page load)
  }, []); // Empty dependency array ensures it runs only on page load

  return (
    <>
      <h1 className="text-center text-5xl my-8">StuDen</h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {listings.map((house: House) => (
          <HouseCard {...house} key={house.title} />
        ))}
      </div>
    </>
  );
}