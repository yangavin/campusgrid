// components/MapView.tsx
'use client';

import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
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
import PopupContent from './PopupContent';
import './map.css';

interface MapProps {
  listings: House[];
  hoveringId: string | null;
}

export default function MapView({ listings, hoveringId }: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<House | null>(null);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (hoveringId) {
      const house = listings.find((h) => h.id === hoveringId);
      if (house) {
        setSelectedMarker(house);
      }
    }
  }, [hoveringId, listings]);

  return (
    <>
      <Map
        mapboxAccessToken="pk.eyJ1IjoiYWZmeXRvIiwiYSI6ImNtMzExbnVidDBxbWsydG9nN29pb3N3bDcifQ.X9RhpPQwZD2hPNwxU9olPQ"
        initialViewState={{
          longitude: -76.49984,
          latitude: 44.229166,
          zoom: 14,
        }}
        style={{ height: '100vh' }}
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
              color="#a991e6"
            />
            {selectedMarker?.id === house.id && (
              <Popup
                longitude={house.coordinates!.longitude}
                latitude={house.coordinates!.latitude}
                anchor="top"
                offset={25}
                onClose={() => setSelectedMarker(null)}
                className="overflow-hidden"
                maxWidth="300px"
                closeButton={false}
              >
                {user ? (
                  <a
                    href={house.link}
                    target="_blank"
                    className="block transition-opacity hover:opacity-90"
                  >
                    <PopupContent house={house} />
                  </a>
                ) : (
                  <div
                    className="cursor-pointer transition-opacity hover:opacity-90"
                    onClick={() => setShowSignInDialog(true)}
                  >
                    <PopupContent house={house} />
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
