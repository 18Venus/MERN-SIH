
// import React, { useState, useCallback } from 'react';
// import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// const mapContainerStyle = {
//   height: '700px',
//   width: '100%'
// };

// const defaultCenter = {
//   lat: 13.0590,
//   lng: 77.5816
// };

// const blueIcon = {
//   url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
//   scaledSize: {
//     width: 32,
//     height: 32
//   }
// };

// const redIcon = {
//   url: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
//   scaledSize: {
//     width: 32,
//     height: 32
//   }
// };

// // Array of healthcare centers
// const healthcarecenters = [
//   { lat: 13.0590, lng: 77.5816, name: "Mind and Brain Hospital, Bengaluru" },
//   { lat: 13.006752, lng: 77.561737, name: "Bangalore Hospital, Bengaluru" },
//   { lat: 12.9971, lng: 77.5723, name: "Apollo Clinic, Bengaluru" },
//   { lat: 12.9249, lng: 77.5882, name: "Mindsights, Bengaluru" },
//   { lat: 12.9316, lng: 77.5710, name: "Manospandana, Bengaluru" },
//   { lat: 31.096134, lng: 75.778770, name: "Guru Kirpa, Best Rehab Center, Punjab" },
//   { lat: 18.485870, lng: 73.905853, name: "Ruby Hall Clinic Wanowrie, Maharashtra" },
//   { lat: 28.456789, lng: 77.072472, name: "Fortis Memorial Research Institute, Gurgaon" },
//   { lat: 16.511965, lng: 80.633163, name: "Aakrithi Hospital, Vijayawada, Andhra Pradesh" },
//   { lat: 17.733288, lng: 83.275429, name: "Hashmika Child Clinic, Visakhapatnam" },
//   { lat: 15.589379, lng: 73.816574, name: "Asilo Hospital, Mapusa, Goa" },
//   { lat: 20.457838, lng: 85.871536, name: "RELAX Hospital, Cuttack, Odisha" }
// ];

// function MapComponent() {
//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: 'AIzaSyBcf4ffupmjzX82Tuiq69YJLejwsL3xnpc',
//     libraries: ['places']
//   });

//   const [userLocation, setUserLocation] = useState(null);

//   const onLoad = useCallback((map) => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const pos = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };
//           setUserLocation(pos);
//           map.setCenter(pos);
//         },
//         () => {
//           handleLocationError(true, map);
//         }
//       );
//     } else {
//       handleLocationError(false, map);
//     }
//   }, []);

//   const handleLocationError = useCallback((browserHasGeolocation, map) => {
//     if (!browserHasGeolocation) {
//       alert('Error: Your browser doesn\'t support geolocation.');
//     } else {
//       alert('Error: The Geolocation service failed.');
//     }
//   }, []);

//   if (loadError) {
//     return <div>Error loading maps</div>;
//   }

//   if (!isLoaded) {
//     return <div>Loading Maps</div>;
//   }

//   return (
//     <GoogleMap
//       mapContainerStyle={mapContainerStyle}
//       zoom={5}
//       center={defaultCenter}
//       onLoad={onLoad}
//     >
//       {userLocation && (
//         <Marker
//           position={userLocation}
//           title="Your Location"
//           icon={blueIcon}
//         />
//       )}
//       {healthcarecenters.map((center, index) => (
//         <Marker
//           key={index}
//           position={{ lat: center.lat, lng: center.lng }}
//           title={center.name}
//           icon={redIcon}
//         />
//       ))}
//     </GoogleMap>
//   );
// }

// export default MapComponent;

import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '700px',
  width: '100%'
};

const defaultCenter = {
  lat: 13.0590,
  lng: 77.5816
};

const blueIcon = {
  url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
  scaledSize: {
    width: 32,
    height: 32
  }
};

const redIcon = {
  url: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
  scaledSize: {
    width: 32,
    height: 32
  }
};

// Array of healthcare centers
const healthcarecenters = [
  { lat: 13.0590, lng: 77.5816, name: "Mind and Brain Hospital, Bengaluru" },
  { lat: 13.006752, lng: 77.561737, name: "Bangalore Hospital, Bengaluru" },
  { lat: 12.9971, lng: 77.5723, name: "Apollo Clinic, Bengaluru" },
  { lat: 12.9249, lng: 77.5882, name: "Mindsights, Bengaluru" },
  { lat: 12.9316, lng: 77.5710, name: "Manospandana, Bengaluru" },
  { lat: 31.096134, lng: 75.778770, name: "Guru Kirpa, Best Rehab Center, Punjab" },
  { lat: 18.485870, lng: 73.905853, name: "Ruby Hall Clinic Wanowrie, Maharashtra" },
  { lat: 28.456789, lng: 77.072472, name: "Fortis Memorial Research Institute, Gurgaon" },
  { lat: 16.511965, lng: 80.633163, name: "Aakrithi Hospital, Vijayawada, Andhra Pradesh" },
  { lat: 17.733288, lng: 83.275429, name: "Hashmika Child Clinic, Visakhapatnam" },
  { lat: 15.589379, lng: 73.816574, name: "Asilo Hospital, Mapusa, Goa" },
  { lat: 20.457838, lng: 85.871536, name: "RELAX Hospital, Cuttack, Odisha" }
];

function MapComponent() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBcf4ffupmjzX82Tuiq69YJLejwsL3xnpc',
    libraries: ['places']
  });

  const [userLocation, setUserLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const onLoad = useCallback((map) => {
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

  const handleLocationError = useCallback((browserHasGeolocation, map) => {
    if (!browserHasGeolocation) {
      alert('Error: Your browser doesn\'t support geolocation.');
    } else {
      alert('Error: The Geolocation service failed.');
    }
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete.current) {
      const place = autocomplete.current.getPlace();
      if (place.geometry) {
        const pos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setSelectedPlace({
          lat: pos.lat,
          lng: pos.lng,
          name: place.name
        });
      } else {
        alert('Place not found');
      }
    } else {
      alert('Autocomplete not loaded');
    }
  };

  const autocomplete = React.useRef(null);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={5}
      center={defaultCenter}
      onLoad={onLoad}
    >
      <Autocomplete
        onLoad={(autocomplete) => {
          autocomplete.current = autocomplete;
        }}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Enter a location"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: "absolute",
            left: "50%",
            marginLeft: "-120px"
          }}
        />
      </Autocomplete>

      {userLocation && (
        <Marker
          position={userLocation}
          title="Your Location"
          icon={blueIcon}
        />
      )}
      {selectedPlace && (
        <Marker
          position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
          title={selectedPlace.name}
          icon={redIcon}
        />
      )}
      {healthcarecenters.map((center, index) => (
        <Marker
          key={index}
          position={{ lat: center.lat, lng: center.lng }}
          title={center.name}
          icon={redIcon}
        />
      ))}
    </GoogleMap>
  );
}

export default MapComponent;





