'use client';

import { LayoutProps } from '../../../.next/types/app/layout';
import { ModeToggle } from '@/app/ThemeButton';
import { Button } from '@/components/ui/button';
import { auth } from '@/app/firebase';
import { useRouter } from 'next/navigation';

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  function signOut() {
    auth.signOut();
    router.replace('/');
  }

  return (
    <>
      <div className="m-4 flex justify-between">
        <ModeToggle />
        <Button onClick={signOut}>Log out</Button>
      </div>
      <h1 className="my-4 text-center text-5xl">Affyto</h1>

      <div className="mb-10">
        <h2 className="mb-2 text-center text-xl">
          <a
            href="https://www.instagram.com/affyto.housing/"
            target="_blank"
            className="text-primary underline"
          >
            Shoot us an Instagram DM
          </a>
        </h2>
        <h2 className="text-center">
          We value your feedback and we always respond!
        </h2>
      </div>
      {children}
    </>
  );
}
