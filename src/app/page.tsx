"use client";

import ListingContainer from "./ListingContainer";
import { ModeToggle } from "./ThemeButton";
import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth, analytics, admissionLink } from "./firebase-dev";
import  { Button } from "@/components/ui/button";
import { createContext, useState } from "react";
import { setUserProperties } from "firebase/analytics";
import useSWR from "swr";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserData } from "./models";

const db = getFirestore();

const loadUserData = async (userId: string, data: any) => {
  try{
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        // Save new user data if it’s the first sign-up
        await setDoc(userRef, data);
    }
  } catch (err){
    console.log(err)
  }
};


export const UserContext = createContext<UserData | null>(null);
export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showListings, setShowListings] = useState(true);
  const {data: isAdmitted, isLoading: checkingAdmission, error: admissionError} = useSWR(user, async ()=>getAdmission(user?.email!), {revalidateOnFocus: false});

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
    setLoadingUser(false);
  });

async function getAdmission(email: string | null){
  if (!email){
    return false;
  }
  const res = await fetch(admissionLink + `?email=${email}`);
  const admission = await res.text();
  if (admission === "true"){
    const result = await analytics;
    if (result){
    setUserProperties(result, {
      email: user?.email
    })
    return true;
    }
  }
  return false;
}

  const signIn = async () =>{
    const result = await signInWithPopup(auth, new GoogleAuthProvider())
    const user = result.user
    await loadUserData(user.uid, {name: user.displayName, email: user.email});

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef); 
    setUser(user);
    setUserData(docSnap.data() as UserData);
  }
  let status: string;
  if (checkingAdmission || loadingUser) status = "loading"
  else if (!user) status = "unauthenticated"
  else if (!isAdmitted) status = "unadmitted"
  else status = "authorized"

  return (
    <UserContext.Provider value={userData}>
        <div className="flex justify-between m-4">
          <ModeToggle/>
          {(status === "unadmitted" || status === "authorized") && (
            <Button onClick={()=>{
              auth.signOut();
              setUser(null);
              setUserData(null);
            }}>
                Log out
            </Button>
          )}
        </div>
      <h1 className="text-center text-5xl my-4">Affyto</h1>

      <div className="mb-10">
        <h2 className="text-xl text-center mb-2">
          <a href="https://www.instagram.com/affyto.housing/" target="_blank" className="text-primary underline">Shoot us an Instagram DM</a>
        </h2>
        <h2 className="text-center">We value your feedback and we always respond!</h2>
      </div>
        <div className="mb-10 flex justify-center">
          {showListings && (status !== "loading") && <Button onClick={()=>setShowListings(false)}>Go to Sublets</Button>}
          {!showListings && (status !== "loading") && <Button onClick={()=>setShowListings(true)}>Go to Listings</Button>}
        </div>
  
      {status === "loading" && <h2 className="text-center">Loading...</h2>}

      {status === "unauthenticated" && (
        <div className="flex flex-col items-center justify-center gap-8">
          <Button onClick={signIn}>Sign in with Google</Button>
        </div>
      )}

      {status === "unadmitted" && (
        <div className="flex flex-col items-center justify-center gap-8">
          <a className="text-xl text-blue-400 underline" href="https://forms.gle/P7VtFqQsA5tacDpaA" target="_blank">
            Join our waitlist to test our beta!
          </a>
        </div>
      )}

      {status === "authorized" && (
        <ListingContainer showListings={showListings} />
      )}

    </UserContext.Provider>
  );
}
