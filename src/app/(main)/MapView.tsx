'use client';

import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import House from '@/app/models';
import { useAuth } from './AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SignInButton from './SignInButton';

interface MapProps {
  listings: House[];
}

export default function MapView({ listings }: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<House | null>(null);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const { user } = useAuth();

  const popupContent = (house: House) => (
    <div className="rounded-lg">
      <h3>{house.title}</h3>
      <img
        src={house.image}
        alt="house"
        className="mb-2 aspect-[16/9] w-full rounded-lg object-cover object-center"
      />
      <p>{house.address}</p>
      <p className="font-bold">{house.beds} Beds</p>
      <p className="font-bold">${house.price}/mo.</p>
    </div>
  );

  return (
    <>
      <Map
        mapboxAccessToken="pk.eyJ1IjoiYWZmeXRvIiwiYSI6ImNtMzExbnVidDBxbWsydG9nN29pb3N3bDcifQ.X9RhpPQwZD2hPNwxU9olPQ"
        initialViewState={{
          longitude: -76.49984,
          latitude: 44.229166,
          zoom: 14,
        }}
        style={{
          height: '100vh',
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {listings.map((house) => (
          <div key={house.id}>
            <Marker
              longitude={house.coordinates!.longitude}
              latitude={house.coordinates!.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedMarker(house);
              }}
            />
            {selectedMarker?.id === house.id && (
              <Popup
                longitude={house.coordinates!.longitude}
                latitude={house.coordinates!.latitude}
                anchor="top"
                offset={25}
                onClose={() => setSelectedMarker(null)}
              >
                {user ? (
                  <a href={house.link} target="_blank">
                    {popupContent(house)}
                  </a>
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowSignInDialog(true)}
                  >
                    {popupContent(house)}
                  </div>
                )}
              </Popup>
            )}
          </div>
        ))}
      </Map>

      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Find Your Perfect Place Now!
            </DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                Sign in now to access hundreds of listings and find your perfect
                place with ease!
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <SignInButton onSignInSuccess={() => setShowSignInDialog(false)} />
          </div>
          <p className="text-[10px] text-muted-foreground">
            We do not endorse listings on our platform and cannot guarantee
            their authenticity. Users should verify listings independently
            before engagement.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
