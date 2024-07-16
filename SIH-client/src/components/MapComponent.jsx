import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '700px',
  width: '100%'
};

const defaultCenter = {
  lat: 13.0590,
  lng: 77.5816
};

const healthcarecenters = [
  { lat: 13.0590, lng: 77.5816, name: "Mind and brain hospital, Bengaluru" },
  { lat: 13.006752, lng: 77.561737, name: "Bangalore Hospital, Bengaluru" },
  { lat: 12.9971, lng: 77.5723, name: "Apollo clinic, Bengaluru" },
  { lat: 12.9249, lng: 77.5882, name: "Mindsights, Bengaluru" },
  { lat: 12.9316, lng: 77.5710, name: "Manospandana, Bengaluru" },
  { lat: 31.096134, lng: 75.778770, name: "Guru Kirpa, Best Rehab Center, Punjab" },
  { lat: 18.485870, lng: 73.905853, name: "Ruby Hall Clinic Wanowrie, Maharashtra, India" },
  { lat: 28.456789, lng: 77.072472, name: "Fortis Memorial Research Institute, Gurgaon" },
  { lat: 16.511965, lng: 80.633163, name: "Aakrithi Hospital, Vijayawada, Andhra Pradesh" },
  { lat: 17.733288, lng: 83.275429, name: "Hashmika Child Clinic, Visakhapatnam" },
  { lat: 15.589379, lng: 73.816574, name: "Asilo Hospital, Mapusa, Goa" },
  { lat: 20.457838, lng: 85.871536, name: "RELAX Hospital, Cuttack, Orrisa, Odisha" }
];

const restaurantIcon = {
  url: 'https://imgs.search.brave.com/lR-ExKAVgRsSFn5YvKEN55Y4731PwlR4CEV6-ctWA-4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4taWNvbnMtcG5nLmZsYXRpY29uLmNvbS8xMjgvNzQwMy83NDAzMzkwLnBuZw',
  scaledSize: {
    width: 32,
    height: 32
  }
};

function MapComponent() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBcf4ffupmjzX82Tuiq69YJLejwsL3xnpc',
  });

  const [userLocation, setUserLocation] = useState(null);

  const onLoad = useCallback(function callback(map) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(pos);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, map);
        }
      );
    } else {
      handleLocationError(false, map);
    }
  }, []);

  const handleLocationError = (browserHasGeolocation, map) => {
    if (!browserHasGeolocation) {
      alert('Error: Your browser doesn\'t support geolocation.');
    } else {
      alert('Error: The Geolocation service failed.');
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      onLoad={onLoad}
      center={defaultCenter}
    >
      {userLocation && (
        <Marker
          position={userLocation}
          title="Your Location"
          icon={{
            url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
            scaledSize: { width: 32, height: 32 }
          }}
        />
      )}
      {healthcarecenters.map((center, index) => (
        <Marker
          key={index}
          position={{ lat: center.lat, lng: center.lng }}
          title={center.name}
          icon={restaurantIcon}
        />
      ))}
    </GoogleMap>
  );
}

export default MapComponent;
