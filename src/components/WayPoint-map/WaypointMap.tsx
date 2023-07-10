import { GoogleMap } from "@react-google-maps/api";
import { isNumber } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAppSelector } from "../../store";
import {
  selectUserDropdown,
  selectUserName,
  selectUserWeight,
} from "../../store/form/formSelectors";

type MapOptions = google.maps.MapOptions;

const WaypointMap = () => {
  const userName = useAppSelector(selectUserName);
  const userWeight = useAppSelector(selectUserWeight);
  const userDropdown = useAppSelector(selectUserDropdown);

  const parsedDropdown = parseFloat(userDropdown);
  const parsedWeight = parseFloat(userWeight);

  let totalDuration = 0;
  const [calsLost1, setCalsLost1] = useState<number>(0);
  const [numOfWaypoints, setNumOfWayoints] = useState<number>(0);
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "55ec9d32771d5e8c",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  function initMap(): void {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 14,
        center: { lat: 53.483959, lng: -2.244644 },
      }
    );

    directionsRenderer.setMap(map);

    (document.getElementById("submit") as HTMLElement).addEventListener(
      "click",
      () => {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
      }
    );

    function calculateAndDisplayRoute(
      directionsService: google.maps.DirectionsService,
      directionsRenderer: google.maps.DirectionsRenderer
    ) {
      const waypts: google.maps.DirectionsWaypoint[] = [];
      const checkboxArray = document.getElementById(
        "waypoints"
      ) as HTMLSelectElement;

      for (let i = 0; i < checkboxArray.length; i++) {
        if (checkboxArray.options[i].selected) {
          waypts.push({
            location: (checkboxArray[i] as HTMLOptionElement).value,
            stopover: true,
          });
        }
      }

      directionsService
        .route({
          origin: (document.getElementById("start") as HTMLInputElement).value,
          destination: (document.getElementById("end") as HTMLInputElement)
            .value,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.WALKING,
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
          console.log(response);

          const route = response.routes[0];
          const summaryPanel = document.getElementById(
            "directions-panel"
          ) as HTMLElement;

          summaryPanel.innerHTML = "";

          // For each route, display summary information.
          if (route && route.legs) {
            for (let i = 0; i < route.legs.length; i++) {
              const routeSegment = i + 1;

              summaryPanel.innerHTML +=
                "<b>Route Segment: " + routeSegment + "</b><br>";
              summaryPanel.innerHTML += route.legs[i].start_address + " to ";
              summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
              const length1 = route.legs.length;

              setNumOfWayoints(length1);
              const leg = route.legs[i];

              const legDurationValue = leg.duration?.value || 0;
              totalDuration += legDurationValue;
              console.log("Total duration 1:", totalDuration);

              const mins = (): string => {
                if (leg.duration?.value === undefined) return "0";
                else return (leg.duration?.value / 60).toString();
              };

              const parsedDropdown = parseFloat(userDropdown);
              const parsedWeight = parseFloat(userWeight);
              const parsedMins = Math.floor(parseFloat(mins() || "0"));
              const calsLost = Math.floor(
                ((parsedDropdown * 3.5 * parsedWeight) / 200) * parsedMins
              );
              const distanceText = leg.distance?.text || "Unknown distance";

              summaryPanel.innerHTML += distanceText + "<br><br>";
              summaryPanel.innerHTML += leg.duration?.text + "<br><br>";

              // If the calorie form is not filled out this will not be displayed
              if (!Number.isNaN(calsLost)) {
                summaryPanel.innerHTML += `you will lose ${calsLost}<br><br>`;
              }

              processTotalDuration(totalDuration);
            }
          }
        })
        .catch((e) => window.alert("Directions request failed due to " + e));
    }
  }

  const processTotalDuration = (duration: number) => {
    // Access totalDuration here or perform any other operations
    console.log("Total Duration 2:", duration);

    // Calculate calsLost1 using totalDuration
    const calsLost1 = Math.floor(
      ((parsedDropdown * 3.5 * parsedWeight) / 200) * (duration / 60)
    );
    setCalsLost1(calsLost1);
  };

  // const formattedCalsLost = Number.isNaN(calsLost1) ? "" : calsLost1;
  const calslostDividedByWaypoint = calsLost1 / numOfWaypoints;
  console.log("big cals", calslostDividedByWaypoint);

  useEffect(() => {
    initMap();
  }, []);

  console.log({ user: { userName } });
  // console.log({ calories: { calslostDividedByWaypoint } });

  // If calsLost returns NaN it will return an empty string
  // const formattedCalsLost = Number.isNaN(calsLost1) ? "" : calsLost1;

  return (
    <>
      <div className="map-container">
        <div className="controls-container">
          <div id="sidebar">
            <div>
              <b>Start:</b>
              <select id="start">
                <option value=" 66 N Western St, Manchester M12 6DD">
                  Manchester Brewing
                </option>
                <option value="99 N Western St, Manchester M12 6JL">
                  Alphabet Brewing
                </option>
                <option value="75 N Western St, Manchester M12 6DY">
                  Beer Nouveau
                </option>
                <option value="Unit 18, Piccadilly Trading Estate, Manchester M1 2NP">
                  Track Brewing Co - Brewery & Taproom
                </option>
                <option value="35 Peter St, Manchester M2 5BG">
                  BrewDog Manchester
                </option>
                <option value="5 Jack Rosenthal St, Manchester M15 4RA">
                  The Gas Works Brewbar
                </option>
                <option value="10 Tariff St, Manchester M1 2FF">
                  Northern Monk Refectory MCR
                </option>
              </select>
              <br />
              <b>Waypoints:</b> <br />
              <i>(Ctrl+Click or Cmd+Click for multiple selection)</i> <br />
              <select multiple id="waypoints">
                <option value="15 Red Bank, Cheetham Hill, Manchester M4 4HF">
                  Beatnikz Republic Brewing Co.
                </option>
                <option value="Empire St, Cheetham Hill, Manchester M3 1JD">
                  Joseph Holt Brewery
                </option>
                <option value=" 66 N Western St, Manchester M12 6DD">
                  Manchester Brewing
                </option>
                <option value="99 N Western St, Manchester M12 6JL">
                  Alphabet Brewing
                </option>
                <option value="75 N Western St, Manchester M12 6DY">
                  Beer Nouveau
                </option>
                <option value="Unit 18, Piccadilly Trading Estate, Manchester M1 2NP">
                  Track Brewing Co - Brewery & Taproom
                </option>
                <option value="35 Peter St, Manchester M2 5BG">
                  BrewDog Manchester
                </option>
                <option value="5 Jack Rosenthal St, Manchester M15 4RA">
                  The Gas Works Brewbar
                </option>
                <option value="10 Tariff St, Manchester M1 2FF">
                  Northern Monk Refectory MCR
                </option>
              </select>
              <br />
              <b>End:</b>
              <select id="end">
                <option value=" 66 N Western St, Manchester M12 6DD">
                  Manchester Brewing
                </option>
                <option value="99 N Western St, Manchester M12 6JL">
                  Alphabet Brewing
                </option>
                <option value="75 N Western St, Manchester M12 6DY">
                  Beer Nouveau
                </option>
                <option value="Unit 18, Piccadilly Trading Estate, Manchester M1 2NP">
                  Track Brewing Co - Brewery & Taproom
                </option>
                <option value="35 Peter St, Manchester M2 5BG">
                  BrewDog Manchester
                </option>
                <option value="5 Jack Rosenthal St, Manchester M15 4RA">
                  The Gas Works Brewbar
                </option>
                <option value="10 Tariff St, Manchester M1 2FF">
                  Northern Monk Refectory MCR
                </option>
              </select>
              <br />
              <input type="submit" id="submit" />
            </div>
            <div id="directions-panel"></div>
            <p>
              {userName === "" ? "" : `${userName} your journey will take `}
            </p>
            <h1>
              {!Number.isNaN(calslostDividedByWaypoint) &&
                `you will lose ${calslostDividedByWaypoint} over the entire journey`}
            </h1>
          </div>
        </div>

        <GoogleMap
          id="map"
          mapContainerStyle={{ height: "400px", width: "100%" }}
          zoom={12}
          center={{ lat: 41.85, lng: -87.65 }}
          options={options}
        ></GoogleMap>
      </div>
    </>
  );
};

export default WaypointMap;
