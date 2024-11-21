"use client"

import { useAuth } from "./AuthProvider"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { auth, checkAnalytics } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { logEvent } from "firebase/analytics";


export default function Page(){
    const { user, signIn } = useAuth()
    const router = useRouter()
    if (user) router.push("/listings")

    return (
        <div>
            <Button onClick={signIn}>Log in</Button>
        </div>
    )
}