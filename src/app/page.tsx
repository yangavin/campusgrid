"use client"

import { useAuth } from "./AuthProvider"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";



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