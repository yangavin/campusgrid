"use client"

import { LayoutProps } from "../../../.next/types/app/layout";
import { ModeToggle } from "@/app/ThemeButton";
import { Button } from "@/components/ui/button";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";


export default function Layout({ children }: LayoutProps) {
  const router= useRouter()

  function signOut(){
    auth.signOut();
    router.replace("/")
  }

  return (
    <>
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
        {children}
    </>
  )
}