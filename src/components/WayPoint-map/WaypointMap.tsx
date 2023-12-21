import { GoogleMap } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

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
  const [journeyTime, setJourneyTime] = useState<number>(0);
  const [leg, setLeg] = useState<google.maps.DirectionsLeg | null>(null);

  const options = useMemo<MapOptions>(
    () => ({
      mapId: "55ec9d32771d5e8c",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    [],
  );

  function initMap(): void {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 14,
        center: { lat: 53.483959, lng: -2.244644 },
      },
    );

    directionsRenderer.setMap(map);

    (document.getElementById("submit") as HTMLElement).addEventListener(
      "click",
      () => {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
      },
    );

    function calculateAndDisplayRoute(
      directionsService: google.maps.DirectionsService,
      directionsRenderer: google.maps.DirectionsRenderer,
    ) {
      const waypts: google.maps.DirectionsWaypoint[] = [];
      const checkboxArray = document.getElementById(
        "waypoints",
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
            "directions-panel",
          ) as HTMLElement;

          summaryPanel.innerHTML = "";
          totalDuration = 0;

          // For each route, display summary information.
          if (route && route.legs) {
            for (let i = 0; i < route.legs.length; i++) {
              const routeSegment = i + 1;

              summaryPanel.innerHTML +=
                "<b>Route Segment: " + routeSegment + "</b><br>";
              summaryPanel.innerHTML += route.legs[i].start_address + " to ";
              summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
              const length1 = route.legs.length;

              //set the number of way points on journey
              setNumOfWayoints(length1);

              const leg = route.legs[i];
              setLeg(leg);
              const legDurationValue = leg.duration?.value || 0;
              console.log("leg duration :", legDurationValue);
              totalDuration += legDurationValue;

              const mins = (): string => {
                if (leg.duration?.value === undefined) return "0";
                else return (leg.duration?.value / 60).toString();
              };

              const parsedDropdown = parseFloat(userDropdown);
              const parsedWeight = parseFloat(userWeight);
              const parsedMins = Math.floor(parseFloat(mins() || "0"));
              const calsLost = Math.floor(
                ((parsedDropdown * 3.5 * parsedWeight) / 200) * parsedMins,
              );
              const distanceText = leg.distance?.text || "Unknown distance";

              // Update JourneyTime state
              setJourneyTime(totalDuration);

              summaryPanel.innerHTML += distanceText + "<br><br>";
              summaryPanel.innerHTML += leg.duration?.text + "<br><br>";

              // If the calorie form is not filled out this will not be displayed
              if (!Number.isNaN(calsLost)) {
                summaryPanel.innerHTML += `you will lose ${calsLost} calories on this leg of the journey <br><br>`;
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

    // Calculate calsLost1 using totalDuration
    const calsLost1 = Math.floor(
      ((parsedDropdown * 3.5 * parsedWeight) / 200) * (duration / 60),
    );
    setCalsLost1(calsLost1);
  };

  // console.log(mins());

  // total calories of journey divide by the number of waypoints
  // const calslostDividedByWaypoint = calsLost1;

  //hours and minutes const
  const hours = Math.floor(journeyTime / 3600);
  const minutes = Math.floor((journeyTime % 3600) / 60);

  console.log("leg way", leg?.steps);

  useEffect(() => {
    initMap();
  }, []);

  return (
    <>
      <div className="map-container">
        <div className="controls-container">
          <div id="sidebar">
            <h1 className="header">{userName}</h1>
            <h2 className="sub-header">Bar Hop Map</h2>
            <hr />
            <p className="paragraph">
              The bar hop map will show you how to hop around to your favourite
              breweries and beer venues. Choose a starting venue a finishing
              venue and as many in-between venues as you pls (Ctrl+Click or
              Cmd+Click for multiple selections).
            </p>
            <div>
              <select id="start" className="selection-boxes">
                <option value="" disabled selected>
                  Please select an origin Venue
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

              <select multiple id="waypoints" className="selection-boxes">
                <option value="" disabled selected>
                  Please select your bars
                </option>
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

              <select id="end" className="selection-boxes">
                <option value="" disabled selected>
                  Please select a destinination Venue
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
              <button className="waypointBtn" type="submit" id="submit">
                {" "}
                Get Directions
              </button>
            </div>
            <div id="directions-panel"></div>

            {/* This logic stops the hours and minutes showing up before the route is calculte so NaN is not displayed */}
            {!isNaN(hours) &&
              !isNaN(minutes) &&
              minutes > 0 &&
              (hours > 0 ? (
                <p>
                  Your journey will take {hours} hour{hours === 1 ? "" : "s"}{" "}
                  and {minutes} minute{minutes === 1 ? "" : "s"}
                </p>
              ) : (
                <p>
                  Your journey will take {minutes} minute
                  {minutes === 1 ? "" : "s"}
                </p>
              ))}

            <h1>
              {!Number.isNaN(calsLost1) &&
                calsLost1 > 0 &&
                `you will lose ${calsLost1} calories over the entire journey`}
            </h1>
          </div>
        </div>

        <GoogleMap
          id="map"
          mapContainerClassName="map-container1"
          zoom={12}
          center={{ lat: 41.85, lng: -87.65 }}
          options={options}
        ></GoogleMap>
      </div>
    </>
  );
};

export default WaypointMap;
