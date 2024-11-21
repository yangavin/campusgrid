"use client";

import ListingContainer from "./ListingContainer";
import { ModeToggle } from "./ThemeButton";
import { signInWithPopup, GoogleAuthProvider, User, getAdditionalUserInfo } from "firebase/auth";
import { auth, checkAnalytics, admissionLink, db } from "../firebase";
import { Button } from "@/components/ui/button";
import { createContext, useState } from "react";
import { setUserProperties } from "firebase/analytics";
import useSWR from "swr";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserData } from "./models";
import Skeletons from "./Skeletons";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) router.push("/");
  const [showListings, setShowListings] = useState(true); // Default view is "Listings"

  function signOut(){
    auth.signOut();
    router.push("/")
  }

  if (!user) return null;

  return (
    <div>
      <div className="flex justify-between m-4">
        <ModeToggle />
        <Button onClick={signOut}>
          Log out
        </Button>
      </div>
      <h1 className="text-center text-5xl my-4">Affyto</h1>

      <div className="mb-10">
        <h2 className="text-xl text-center mb-2">
          <a
            href="https://www.instagram.com/affyto.housing/"
            target="_blank"
            className="text-primary underline"
          >
            Shoot us an Instagram DM
          </a>
        </h2>
        <h2 className="text-center">We value your feedback and we always respond!</h2>
      </div>

        {/* <Tabs
          defaultValue="listings"
          className="w-full flex flex-col items-center"
          onValueChange={(value) => setShowListings(value === "listings")}
        >
          <TabsList className="flex justify-center mb-4">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="sublets">Sublets</TabsTrigger>
          </TabsList>
          <TabsContent value="listings" className="w-full">
            <ListingContainer showListings={true} />
          </TabsContent>
          <TabsContent value="sublets" className="w-full">
            <ListingContainer showListings={false} />
          </TabsContent>
        </Tabs> */}

        <ListingContainer showListings={true} />
    </div>
  );
}