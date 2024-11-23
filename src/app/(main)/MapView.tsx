'use client';

import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import House from '@/app/models';

interface MapProps {
  listings: House[];
}

export default function MapView({ listings }: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<House | null>(null);

  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoiYWZmeXRvIiwiYSI6ImNtMzExbnVidDBxbWsydG9nN29pb3N3bDcifQ.X9RhpPQwZD2hPNwxU9olPQ"
      initialViewState={{
        longitude: -76.49984,
        latitude: 44.229166,
        zoom: 14,
      }}
      style={{ width: '90vw', height: 600, margin: 'auto', borderRadius: 5 }}
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
              <a href={house.link} target="_blank" className="rounded-lg">
                <h3>{house.title}</h3>
                <img
                  src={house.image}
                  alt="house"
                  className="mb-2 aspect-[16/9] w-full rounded-lg object-cover object-center"
                />
                <p>{house.address}</p>
                <p className="font-bold">{house.beds} Beds</p>
                <p className="font-bold">${house.price}/mo.</p>
              </a>
            </Popup>
          )}
        </div>
      ))}
    </Map>
  );
}
