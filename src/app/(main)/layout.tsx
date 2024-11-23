'use client';

import { ModeToggle } from '@/app/ThemeButton';
import { Button } from '@/components/ui/button';
import { auth } from '@/app/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthProvider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/app/(main)/AppSidebar';
import { useContext, createContext, useState } from 'react';

interface Filter {
  beds: number[];
  maxPrice: number | null;
  source: string[];
}

export const FilterContext = createContext<Filter>({
  beds: [],
  maxPrice: null,
  source: [],
});

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [filter, setFilter] = useState<Filter>({
    beds: [],
    maxPrice: null,
    source: [],
  });
  const router = useRouter();

  function signOut() {
    auth.signOut();
    router.replace('/');
  }
  function setBeds(beds: number[]) {
    setFilter({ ...filter, beds });
  }
  function setMaxPrice(maxPrice: number | null) {
    setFilter({ ...filter, maxPrice });
  }
  function setSource(source: string[]) {
    setFilter({ ...filter, source });
  }

  const { user } = useAuth();
  if (!user) router.replace('/');
  if (!user) return null;

  return (
    <FilterContext.Provider value={filter}>
      <SidebarProvider>
        <AppSidebar
          {...filter}
          setBeds={setBeds}
          setMaxPrice={setMaxPrice}
          setSource={setSource}
        />
        <main>
          <SidebarTrigger />
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
        </main>
      </SidebarProvider>
    </FilterContext.Provider>
  );
}
