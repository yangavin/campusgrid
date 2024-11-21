"use client"

import { useAuth } from "./AuthProvider"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


export default function Page(){
    const { user } = useAuth()
    const router = useRouter()
    if (user) router.push("/listings")

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider)
        router.push("/listings")
    }
    return (
        <div>
            <Button onClick={signIn}>Log in</Button>
        </div>
    )
}