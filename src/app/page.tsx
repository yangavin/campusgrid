"use client";

import ListingContainer from "./ListingContainer";
import { ModeToggle } from "./ThemeButton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <>
        <div className="flex justify-end m-4">
          <ModeToggle/>
        </div>
      <h1 className="text-center text-5xl my-4">Affyto</h1>

      <div className="mb-10">
        <h2 className="text-xl text-center mb-2">
          <a href="https://www.instagram.com/affyto.housing/" target="_blank" className="text-primary underline">Shoot us an Instagram DM</a>
        </h2>
        <h2 className="text-center">We value your feedback and we always respond!</h2>
      </div>

      <ListingContainer />
    </>
  );
}
