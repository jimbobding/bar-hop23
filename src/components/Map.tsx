import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
} from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";

import Distance from "./Distance";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const Map = () => {
  // State
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [directions, setDirections] = useState<DirectionsResult | undefined>(
    undefined,
  );

  const mapRef = useRef<google.maps.Map | null>(null);
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 53.483959, lng: -2.244644 }),
    [],
  );

  // Map options // Use memo so options do not render unless changed
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "55ec9d32771d5e8c",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    [],
  );

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // const houses = useMemo(() => generateHouses(center), [center]);

  const fetchDirections = () => {
    if (!origin || !destination) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      },
    );
  };

  return (
    <div className="map-container">
      <div className="controls-container">
        <div>
          <label htmlFor="origin">Where you at: </label>
          <Autocomplete
            onLoad={(autocomplete) =>
              autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place && place.geometry) {
                  setOrigin(place.formatted_address || "");
                }
              })
            }
          >
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </Autocomplete>
        </div>
        <div>
          <label htmlFor="destination">Where you wanna be: </label>
          <Autocomplete
            onLoad={(autocomplete) =>
              autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place && place.geometry) {
                  setDestination(place.formatted_address || "");
                }
              })
            }
          >
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </Autocomplete>
        </div>
        <button className="calMap-btn" onClick={fetchDirections}>
          Get Directions
        </button>
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container1"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;
