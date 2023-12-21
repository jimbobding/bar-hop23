import { useEffect, useState } from "react";

import { useAppSelector } from "../../store";
import {
  selectUserDropdown,
  selectUserName,
  selectUserWeight,
} from "../../store/form/formSelectors";

type GeoInformationProps = {
  leg: google.maps.DirectionsLeg;
};

const GeoInformation: React.FC<GeoInformationProps> = ({ leg }) => {
  const userName = useAppSelector(selectUserName);
  const userWeight = useAppSelector(selectUserWeight);
  const userDropdown = useAppSelector(selectUserDropdown);
  const [isOpen, setIsOpen] = useState(false);
  const [formattedInstructions, setFormattedInstructions] = useState<string[]>(
    [],
  );

  function toggle() {
    setIsOpen((isOpen) => !isOpen);
  }
  //Will change when [leg] is changed
  useEffect(() => {
    //Will  only execute if leg and leg.steps exist
    if (leg && leg.steps) {
      //Maps over each instruction in the leg
      const instructions = leg.steps.map((step) => step.instructions);
      //Instructions array is mapped over and uses regEx to replpace the html tags
      // with empty strings
      const formatted = instructions.map((instruction) =>
        instruction.replace(/<[^>]+>/g, ""),
      );
      setFormattedInstructions(formatted);
    }
  }, [leg]);

  if (!leg) {
    return <div>No distance information available</div>;
  }

  const parsedDropdown = parseFloat(userDropdown);
  const parsedWeight = parseFloat(userWeight);

  const mins = () => {
    if (leg.duration?.value === undefined) return "no duration";
    else return (leg.duration?.value / 60).toString();
  };

  const parsedMins = Math.floor(parseFloat(mins() || "0"));

  // const parsedHours = Math.floor(parseFloat(hours() || "0"));

  const calsLost = Math.floor(
    ((parsedDropdown * 3.5 * parsedWeight) / 200) * parsedMins,
  );

  const formattedCalsLost = Number.isNaN(calsLost) ? "" : calsLost;

  return (
    <>
      <div className="distance-container">
        <h2>Distance Information</h2>
        <hr />

        <div>
          <strong>Start Address:</strong> {leg.start_address}
        </div>
        <div>
          <strong>End Address:</strong> {leg.end_address}
        </div>
        <div>
          <hr />
          <div className="info">
            <h2>Journey Information</h2>
            <hr />
            <p>
              {userName === undefined
                ? ""
                : `${userName} your journey will take `}
            </p>
            <p>
              <strong>{leg.duration?.text} </strong>
            </p>
            you will cover <strong>{leg.distance?.text} </strong>
            {/* <strong>{miles()} Miles</strong>{" "} */}
            <strong>
              <strong>
                {formattedCalsLost === ""
                  ? ""
                  : `you will lose ${formattedCalsLost} calories`}
              </strong>
            </strong>
          </div>
          <strong>Distance:</strong> {leg.distance?.text}
        </div>
        <div>
          <strong>Duration:</strong> {leg.duration?.text}
        </div>
        <div>
          <hr />
          <h2>Time</h2>
          <hr />
          <strong>Duration in Seconds:</strong> {leg.duration?.value}
        </div>
        <div>
          <div>
            <strong>Duration in minutes:</strong> {parsedMins}
          </div>
          <div>{/* <strong>Duration in hours:</strong> {parsedHours} */}</div>
          <hr />
          <h2>Directions</h2>
          <hr />
          <button className="calMap-btn" onClick={toggle}>
            Directions
          </button>
          {isOpen && (
            <div className="instruction">
              {" "}
              {formattedInstructions.map((instruction, index) => (
                <p key={index}>{instruction}</p>
              ))}
            </div>
          )}

          <div className="instructions-container"> </div>
        </div>
      </div>
    </>
  );
};

export default GeoInformation;
