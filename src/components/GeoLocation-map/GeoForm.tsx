import {
  faClock,
  faPersonWalking,
  faScaleBalanced,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAppSelector } from "../../store";
import {
  selectUserDropdown,
  selectUserName,
  selectUserTime,
  selectUserWeight,
} from "../../store/form/formSelectors";

const GeoForm = () => {
  const userName = useAppSelector(selectUserName);
  const userWeight = useAppSelector(selectUserWeight);
  const userDropdown = useAppSelector(selectUserDropdown);
  const userTime = useAppSelector(selectUserTime);

  return (
    <>
      <form>
        <div className="grid-container">
          <div className="grid-even-columns">
            <div className="icon">
              <FontAwesomeIcon className="fa-icon" icon={faUser} />{" "}
              <p>{userName}</p>
            </div>
            <div className="icon">
              {" "}
              <FontAwesomeIcon
                className="fa-icon"
                icon={faScaleBalanced}
              />{" "}
              <p>{userWeight}</p>
            </div>
            <div className="icon">
              {" "}
              <FontAwesomeIcon className="fa-icon" icon={faClock} />
              <p>{userTime}</p>
            </div>
            <div className="icon">
              {" "}
              <FontAwesomeIcon
                className="fa-icon"
                icon={faPersonWalking}
              />{" "}
              <p>{userDropdown}</p>
            </div>
            <div className="row">
              Fill in your details at{" "}
              <a className="about-link" href="/about">
                about
              </a>
            </div>
          </div>

          <div className="grid-one-columns">
            <div className="column col1">
              <div className="card">
                <div className="card-container">
                  <h4>
                    <b className="name">{userName}</b>
                  </h4>
                  <p>
                    You burn {calsBun} calories on a {userTime} minute walk
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

export default GeoForm;
