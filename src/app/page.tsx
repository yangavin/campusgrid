"use client";

import ListingContainer from "./ListingContainer";
import { ModeToggle } from "./ThemeButton";

export default function Home() {
  return (
    <>
        <div className="flex justify-end m-4">
          <ModeToggle/>
        </div>
      <h1 className="text-center text-5xl my-8">Affyto</h1>
      <ListingContainer />
    </>
  );
}
