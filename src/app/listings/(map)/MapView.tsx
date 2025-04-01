// components/MapView.tsx
'use client';

import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import House from '@/app/models';
import PopupContent from './PopupContent';
import './map.css';

interface MapProps {
  listings: House[];
  hoveringId: string | null;
}

export default function MapView({ listings, hoveringId }: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<House | null>(null);

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
        mapboxAccessToken="pk.eyJ1IjoiYWZmeXRvIiwiYSI6ImNtODRzM3hvdjExd2Yya29zeGN4MjRvZnEifQ.NAuvGvwPnaVJPRjvXVCYTg"
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
                <a
                  href={house.link}
                  target="_blank"
                  className="block transition-opacity hover:opacity-90"
                >
                  <PopupContent house={house} />
                </a>
              </Popup>
            )}
          </div>
        ))}
      </Map>
    </>
  );
}
