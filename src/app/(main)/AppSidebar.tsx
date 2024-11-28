import { useState } from 'react';
import { DollarSign, LogOut } from 'lucide-react';
import { auth } from '@/app/firebase';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ModeToggle } from '@/app/ThemeButton';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import House from '../models';
import HouseCard from './listings/HouseCard';
import Skeletons from './Skeletons';
import SignInButton from './SignInButton';

const bedOptions = [1, 2, 3, 4, 5, 6, 7];

interface AppSidebarProps {
  beds: number[];
  maxPrice: number | null;
  source: string[];
  filteredListings: House[];
  isLoading: boolean;
  sourceOptions: string[];
  setBeds: (beds: number[]) => void;
  setMaxPrice: (maxPrice: number | null) => void;
  setSource: (source: string[]) => void;
  setHoveringId: (id: string | null) => void;
}

const sourceFullnames: {
  [key: string]: string;
} = {
  accommodation: 'Acommodation Listings',
  axon: 'Axon',
  amberpeak: 'Amber Peak',
  frontenac: 'Frontenac',
  kijiji: 'Kijiji',
  panadew: 'Panadew',
  homestead: 'Homestead',
  tribond: 'Tribond',
  rentalgauge: 'Rental Gauge',
  limestone: 'Limestone',
  heron: 'Heron',
};
function signOut() {
  auth.signOut();
}

export default function AppSidebar({
  beds,
  maxPrice,
  source,
  filteredListings,
  isLoading,
  sourceOptions,
  setBeds,
  setMaxPrice,
  setSource,
  setHoveringId,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarTrigger className="md:hidden" />
      <SidebarContent>
        {/* <div className="flex items-center justify-between p-4">
          {!user ? (
            <SignInButton />
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to log out?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You will need to log in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={signOut}>
                    Log out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div> */}

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
          <p className="mt-4 text-center text-xs">
            We do not endorse listings on our platform and cannot guarantee
            their authenticity. Users should verify listings independently
            before engagement.
          </p>
        </div>

        <SidebarGroup>
          <h2 className="mb-3 text-center">
            {!isLoading &&
              (filteredListings?.length ? (
                <p>{filteredListings.length} listings</p>
              ) : (
                <p>No listings found</p>
              ))}
          </h2>
          <SidebarGroupContent className="space-y-6">
            {/* Beds Filter */}
            <div className="space-y-2">
              <label className="block text-center font-bold">Beds</label>
              <ToggleGroup
                type="multiple"
                variant={'outline'}
                className="flex gap-2"
                value={beds.map(String)}
                onValueChange={(values) => {
                  setBeds(values.map(Number));
                }}
              >
                {bedOptions.map((bed) => (
                  <ToggleGroupItem
                    key={bed}
                    value={bed.toString()}
                    className="rounded-md px-3 py-2"
                  >
                    {bed}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            {/* Max Price Filter */}
            <div className="mt-4 space-y-2 text-center">
              <label className="block font-bold">Max Price</label>
              <div className="relative flex justify-center">
                <div className="relative w-1/2">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter maximum price"
                    className="pl-8"
                    value={maxPrice || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setMaxPrice(value ? Number(value) : null);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Source Filter */}
            <div className="space-y-2">
              <label className="font-bold">Source</label>
              <div className="flex flex-col space-y-2">
                {sourceOptions.map((sourceOption) => (
                  <div
                    key={sourceOption}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={sourceOption}
                      checked={source.includes(sourceOption)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSource([...source, sourceOption]);
                        } else {
                          setSource(source.filter((s) => s !== sourceOption));
                        }
                      }}
                    />
                    <label
                      htmlFor={sourceOption}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {sourceFullnames[sourceOption]}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-4 flex flex-col justify-center gap-4">
          {isLoading && <Skeletons />}
          {filteredListings?.map((listing) => {
            function setHovering(status: boolean) {
              if (status) {
                setHoveringId(listing.id);
              } else {
                setHoveringId(null);
              }
            }
            return (
              <HouseCard
                key={listing.id}
                {...listing}
                setHovering={setHovering}
              />
            );
          })}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
