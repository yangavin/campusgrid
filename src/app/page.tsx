"use client";

import ListingContainer from "./ListingContainer";
import { ModeToggle } from "./ThemeButton";
import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "./firebase-dev";
import  { Button } from "@/components/ui/button";
import { useState } from "react";
import { db } from "./firebase-dev";
import { getDocs , collection} from "firebase/firestore";

async function getAdmittedUsers(){
  const querySnapshot = await getDocs(collection(db, "admitted_users"));
  const users = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      email: data.email
    } as {email: string};
  });
  return users;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmitted, setIsAdmitted] = useState(false);
  const signIn = async () =>{
    const result = await signInWithPopup(auth, new GoogleAuthProvider())
    const admittedUsers = await getAdmittedUsers()
    setUser(result.user);
    if (admittedUsers?.map(userObj=>userObj.email).includes(result.user.email!)) setIsAdmitted(true);
  }
  if (!user) {
    return (
    <>
      <h1 className="text-center text-5xl my-4">Affyto</h1>

      <div className="mb-10">
      </div>

      <div className="flex flex-col items-center justify-center gap-8">
        <h2 className="text-xl">Sign in to view listings</h2>
        <Button onClick={signIn}>Sign in</Button>
      </div>
    </>
    );
  }
  if (!isAdmitted){
    return (
      <>
        <h1 className="text-center text-5xl my-4">Affyto</h1>

        <div className="flex flex-col items-center justify-center gap-8">
          <a className="text-xl text-primary underline" href="https://forms.gle/P7VtFqQsA5tacDpaA" target="_blank">
            Join our waitlist to test our beta!
          </a>
        </div>
      </>
    );
  }
  return (
    <>
        <div className="flex justify-between m-4">
          <ModeToggle/>
          <img src={user.photoURL!} alt="photo" height={50} width={50}/>
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
