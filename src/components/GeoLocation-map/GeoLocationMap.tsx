import { DirectionsRenderer, GoogleMap } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAppSelector } from "../../store";
import { selectUserName } from "../../store/form/formSelectors";
import GeoInformation from "./GeoInformation";
import Loading from "./Loading";

type DirectionsResult = google.maps.DirectionsResult;
type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

const GeoLocationMap = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clickedMarker, setClickedMarker] = useState<
    | google.maps.places.PlaceResult
    | { formatted_address?: string }
    | null
    | undefined
  >(null);
  const [directions, setDirections] = useState<DirectionsResult | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [destination, setDestination] = useState<string | null>(null);
  const [stepDisplay, setStepDisplay] = useState<google.maps.InfoWindow | null>(
    null,
  );
  const userName = useAppSelector(selectUserName);
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null,
  );
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null,
  );

  const mapRef = useRef<google.maps.Map | null>(null);
  const [center, setCenter] = useState<LatLngLiteral>({
    lat: 51.5072,
    lng: 0.1276,
  });
  const [loading, setLoading] = useState(true);

  const options = useMemo<MapOptions>(
    () => ({
      mapId: "55ec9d32771d5e8c",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    [],
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          setUserLocation({ lat: latitude, lng: longitude });
          setLoading(false); // Set loading to false once geolocation is fetched
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setLoading(false); // Set loading to false even if geolocation fails
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false); // Set loading to false if geolocation is not supported
    }
  }, []);

  const getDistance = (
    userLocation: unknown,
    clickedMarker:
      | google.maps.places.PlaceResult
      | { formatted_address?: string | undefined }
      | null
      | undefined,
  ) => {
    if (!userLocation || !clickedMarker || !clickedMarker.formatted_address) {
      return;
    }

    const origin = userLocation;
    const destination = clickedMarker.formatted_address;
    setDestination(destination);

    const fetchDirections = () => {
      if (!origin || !destination) return;

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
            console.log("result legs ", result.routes[0].legs);
          }
        },
      );

      // Request for distance matrix
      const service = new google.maps.DistanceMatrixService();
      const distanceRequest = {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };

      service.getDistanceMatrix(distanceRequest, (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK) {
          if (
            response &&
            response.rows.length > 0 &&
            response.rows[0].elements.length > 0
          ) {
            const distance = response.rows[0].elements[0].distance;
            console.log("Distance:", distance.text);
            console.log("Distance metres:", distance.value);
          } else {
            console.error("No distance information available.");
          }
        } else {
          console.error("Failed to get distance:", status);
        }
      });
    };

    fetchDirections();
  };

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: mapRef.current,
      });

      // Only execute the rest of the code if geolocation has been fetched
      if (!loading) {
        const service = new google.maps.places.PlacesService(map);
        const infowindow = new google.maps.InfoWindow();

        const createMarker = (place: google.maps.places.PlaceResult) => {
          if (!place.geometry || !place.geometry.location) return;

          const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
          });
          console.log("marker", place.geometry.location.lat);

          google.maps.event.addListener(marker, "click", () => {
            const content = document.createElement("div");
            const nameElement = document.createElement("h2");

            nameElement.textContent = place.name ?? "";
            content.appendChild(nameElement);

            const placeAddressElement = document.createElement("p");

            placeAddressElement.textContent = place.formatted_address ?? "";
            content.appendChild(placeAddressElement);

            infowindow.setContent(content);
            infowindow.open(map, marker);
            console.log("Place:", place.formatted_address);
            // Set clicked marker to Place so it can be referenced outside of the callback
            setClickedMarker(place);
            getDistance(userLocation, place);
            if (directionsServiceRef.current && stepDisplay && mapRef.current) {
              // calculateAndDisplayRoute(
              //   directionsRendererRef.current,
              //   directionsServiceRef.current,
              //   [],
              //   stepDisplay,
              //   mapRef.current
              // );
            }
          });
        };
        setStepDisplay(new google.maps.InfoWindow());
        const request = {
          location: map.getCenter(),
          radius: 5000,
          query: "bar",
          fields: [
            "name",
            "geometry",
            "place_id",
            "formatted_address",
            "formatted_phone_number",
            "website",
            "rating",
            "opening_hours",
            "photos",
            "vicinity",
          ],
        };

        service.textSearch(
          request,
          (
            results: google.maps.places.PlaceResult[] | null,
            status: google.maps.places.PlacesServiceStatus,
          ) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results
            ) {
              for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
              }
            }
          },
        );
      }
    },
    [loading, stepDisplay, userLocation],
  );

  // Loading page to be shown whilst map is loading
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="map-container">
        <div className="controls-container">
          <div>
            <h1 className="header">{userName}</h1>
            <h2 className="sub-header">Geo-Location Map</h2>
            <hr />
            <p className="paragraph">
              The geolocation map takes your position and displays all craft
              beer bars and breweries in a radius of 5000 metres. Please click
              on one to find more information about the venue and also find
              directions with your calorie loss added. Enjoy!
            </p>
          </div>
          {directions && <GeoInformation leg={directions.routes[0].legs[0]} />}
        </div>
        <GoogleMap
          zoom={14}
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
    </>
  );
};

export default GeoLocationMap;
