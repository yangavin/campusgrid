"use client"

import { useAuth } from "./AuthProvider"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { auth, checkAnalytics } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { logEvent } from "firebase/analytics";


export default function Page(){
    const { user } = useAuth()
    const router = useRouter()
    if (user) router.push("/listings")

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider)
        const additionalInfo = getAdditionalUserInfo(result)
        if (additionalInfo?.isNewUser) {
            const analytics = await checkAnalytics;
            if (analytics) logEvent(analytics, "sign_up");
        }
        router.push("/listings")
    }
    return (
        <div>
            <Button onClick={signIn}>Log in</Button>
        </div>
    )
}