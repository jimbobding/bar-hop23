import {
  faBeer,
  faHippo,
  faMapLocationDot,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";

interface UserData {
  f_name: string;
  l_name: string;
  pic: number[] | null;
  id: number;
}

const LandingPage = () => {
  const [userImagePath, setUserImagePath] = useState<string>("");
  const [userData, setUserData] = useState<UserData>({
    f_name: "",
    l_name: "",
    pic: null,
    id: 0,
  });

  //Stores JWT tokens so user data will p[ersist
  const getUserDataFromLocalStorage = () => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  };
  useEffect(() => {
    getUserDataFromLocalStorage();
    fetchUserProfilePicture(userData.id);
  }, [userData.id]);

  // useEffect(() => {
  //   if (userData.id !== 0) {
  //     // Introduce a delay before making the API call
  //     const apiCallDelay = 5000; // 1 second delay (adjust as needed)

  //     setTimeout(() => {
  //       fetchUserProfilePicture(userData.id);
  //     }, apiCallDelay);
  //   }
  // }, [userData.id]);

  const fetchUserProfilePicture = async (userId: number) => {
    try {
      console.log("User ID before API request:", userId);
      const response = await axios.get(
        `http://localhost:3000/image/${userId}/image`,
      );
      console.log("userId", userId);
      console.log("url", `http://localhost:3000/image/${userId}/image`);

      const filePath = response.data.images[0].file_path;

      console.log("File path:", filePath);
      setUserImagePath(filePath);
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };

  console.log("userData", userData);

  return (
    <>
      <header>
        <div className="landing-header">
          <h1>bar hop uk</h1> <br />
        </div>
        <div className="name-header">
          {userData.f_name && userData.l_name ? (
            <p>
              {userData ? (
                <p>
                  Hello, {userData.f_name.trim()} {userData.l_name.trim()}!
                </p>
              ) : (
                <p>Loading...</p>
              )}
            </p>
          ) : null}
        </div>
      </header>
      <main>
        {" "}
        <p>
          {userData.f_name && userData.l_name ? (
            <div className="profile-pic-container">
              <img
                src={`http://localhost:3000${userImagePath}`}
                alt={userData.f_name}
                className="profile-pic"
              />
            </div>
          ) : (
            <div className="logo-container">
              <FontAwesomeIcon
                className="fa-icon fa-hippo landing-hippo"
                icon={faHippo}
              />{" "}
            </div>
          )}
        </p>
        <div className="landing-text">
          <h2>What we do </h2>

          <p className="landing-p">
            Hey, hello and welcome. Bar Hop UK is a unique way of combining
            craft drinking with a little bit of mindfullness to health. With our
            maps we can calculate your route, journey time with your the amount
            of calories you will loose on the journey. Just fill out out your
            own personal calorie form from our{" "}
            <a className="about-link" href="/about">
              about you page{" "}
            </a>{" "}
            you page then visit on our maps on of our maps.
          </p>
        </div>
      </main>
      <aside>
        <div className="landing-card-container">
          <div className="landing-card-col">
            <div className="landing-card">
              {" "}
              <div className="landing-card-image">
                <FontAwesomeIcon className="fa-icon  fa-beer" icon={faMapPin} />
              </div>
              <div className="landing-card-header">
                <a href="/FormMap">
                  {" "}
                  <h3>Calorie Map</h3>
                </a>
                <hr></hr>
              </div>
              <div className="landing-card-text">
                <p>
                  {" "}
                  A map that will calculate the distance, time and calorie loss
                  across two seperate locations.
                </p>
              </div>
            </div>
          </div>
          <div className="landing-card-col">
            {" "}
            <div className="landing-card">
              {" "}
              <div className="landing-card-image">
                <FontAwesomeIcon
                  className="fa-icon  fa-beer"
                  icon={faMapLocationDot}
                />
              </div>
              <div className="landing-card-header">
                <a href="/waypointFormMap">
                  <h3>Bar HOP Map</h3>
                </a>
                <hr></hr>
              </div>
              <div className="landing-card-text">
                <p>
                  A map to plot your route across Manchesters breweries and
                  craft beer bars.{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="landing-card-col">
            {" "}
            <div className="landing-card">
              {" "}
              <div className="landing-card-image">
                <FontAwesomeIcon className="fa-icon  fa-beer" icon={faBeer} />
              </div>
              <div className="landing-card-header">
                <a href="/GeoLocationFormMap">
                  <h3>Geo-location map</h3>
                </a>
                <hr></hr>
              </div>
              <div className="landing-card-text">
                <p>
                  A map that displays the closest breweries and craft beer bars
                  to your location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default LandingPage;
