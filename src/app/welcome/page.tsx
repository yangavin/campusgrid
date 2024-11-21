"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Page(){
    const router = useRouter()
    return (
        <div>
            <h1>Welcome to Affyto</h1>
            <Button onClick={()=> router.push("/listings")}>Start Browsing!</Button>
        </div>
    )
}