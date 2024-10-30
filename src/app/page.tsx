"use client";

import ListingContainer from "./ListingContainer";
import { ModeToggle } from "./ThemeButton";
import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth, analytics, admissionLink, db } from "./firebase-dev";
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

const loadUserData = async (user: User | null): Promise<UserData | null> => {
  if (!user) return null;
  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Save new user data if it’s the first sign-up
      await setDoc(userRef, { uid: user.uid, email: user.email, name: user.displayName });
    }
    return docSnap.data() as UserData;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const UserContext = createContext<UserData | null>(null);

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showListings, setShowListings] = useState(true); // Default view is "Listings"
  const [loadingUser, setLoadingUser] = useState(true);
  const { data: userData, isLoading: loadingUserData, error: userDataError } = useSWR(
    user,
    async () => loadUserData(user),
    { revalidateOnFocus: false }
  );


  auth.onAuthStateChanged(async (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
    setLoadingUser(false);
  });

  const signIn = async () => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    setUser(result.user);
  };


  return (
    <UserContext.Provider value={userData ? userData : null}>
      <div className="flex justify-between m-4">
        <ModeToggle />
        {(user) && (
          <Button
            onClick={() => {
              auth.signOut();
              setUser(null);
            }}
          >
            Log out
          </Button>
        )}
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


      {!user && (
        <div className="flex flex-col items-center justify-center gap-8">
          {loadingUser ? (
            <p>Loading...</p>
          ) : (
            <Button onClick={signIn}>Sign in with Google</Button>
          )}
        </div>
      )}

      {user && (
        <Tabs
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
        </Tabs>
      )}
    </UserContext.Provider>
  );
}