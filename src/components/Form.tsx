import {
  faClock,
  faPersonWalking,
  faScaleBalanced,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
// import { parse, icon } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEventHandler, useState } from "react";

import { useAppDispatch } from "../store";
import {
  setUserCalsBun,
  setUserDropdown,
  setUserName,
  setUserTime,
  setUserWeight,
} from "../store/form/formSlice";

const Form = () => {
  // variables to set the state for the form inputs
  const [weight, setWeight] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [dropdown, setDropdown] = useState<string>("fast");
  const [calsBun, setCalsBun] = useState<number | string>("");
  const [name, setName] = useState<string>("");
  const dispatch = useAppDispatch();

  //Function to dispatch the form input data to the redux store
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(setUserName(name));
    dispatch(setUserWeight(weight));
    dispatch(setUserTime(time));
    dispatch(setUserDropdown(dropdown));
  };

  const handleGetSpeed = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const weightValue = parseFloat(weight);
    const timeValue = parseFloat(time);
    const dropdownValue = parseFloat(dropdown);

    // Check if the parsed values are valid numbers
    if (isNaN(weightValue) || isNaN(timeValue) || isNaN(dropdownValue)) {
      setCalsBun("Invalid input");
    } else {
      const calculatedCalsBun =
        ((dropdownValue * 3.5 * weightValue) / 200) * timeValue;
      setCalsBun(Math.ceil(calculatedCalsBun));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid-container">
          <div className="grid-even-columns">
            <div className="icon">
              <FontAwesomeIcon className="fa-icon" icon={faUser} />{" "}
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  dispatch(setUserName(e.target.value));
                }}
                placeholder="Name..."
                type="text"
                name="name"
                required
              />
            </div>
            <div className="icon">
              {" "}
              <FontAwesomeIcon
                className="fa-icon"
                icon={faScaleBalanced}
              />{" "}
              <input
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  dispatch(setUserWeight(e.target.value));
                }}
                placeholder="Weight in kg's"
                type="text"
                name="weight"
                required
              />
            </div>
            <div className="icon">
              {" "}
              <FontAwesomeIcon className="fa-icon" icon={faClock} />
              <input
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  dispatch(setUserTime(e.target.value));
                }}
                placeholder="Time"
                type="text"
                name="time"
                required
              />
            </div>
            <div className="icon">
              {" "}
              <FontAwesomeIcon
                className="fa-icon"
                icon={faPersonWalking}
              />{" "}
              <select
                value={dropdown}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setDropdown(selectedValue);
                  dispatch(setUserDropdown(selectedValue));
                }}
              >
                <option value="2.3">Slow: 1.7 mph</option>
                <option value="2.5">Medium: 2.9 mph</option>
                <option value="3.3">Fast: 3 mph</option>
                <option value="3.8">Faster 3.6 mph</option>
              </select>
            </div>
            <div className="row">
              <input
                className="submitBtn"
                onClick={handleGetSpeed}
                type="submit"
              />
            </div>
          </div>

          <div className="grid-one-columns">
            <div className="column col1">
              <div className="card">
                <div className="card-container">
                  <h4>
                    <b className="name">{name}</b>
                  </h4>
                  <p>
                    You burn {calsBun} calories on a {time} minute walk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Form;
