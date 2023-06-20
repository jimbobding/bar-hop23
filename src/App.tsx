import { useState } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Footer from "./components/Footer";
import Form from "./components/Form";
// import LandingPage from "./components/LandingPage";
import Map from "./components/Map";
import Nav from "./components/Nav";
import TestRed from "./components/TestRed";
import UserForm from "./components/UserPage/UserForm";
import "./css/CalorieMap.css";
import "./css/Footer.css";
import "./css/Form.css";
import "./css/LandingPage.css";
import "./css/Nav.css";
// import Router from "./router";
import { useAppSelector } from "./store";
import { selectUserWeight } from "./store/form/formSelectors";
import { selectUserName } from "./store/user/selectors";

function App() {
  const [weight, setWeight] = useState("");
  const [dropdown, setDropdown] = useState("");
  const [name, setName] = useState("");
  const userName = useAppSelector(selectUserName);
  const userWeight = useAppSelector(selectUserWeight);
  console.log("weight:", weight);
  console.log("dropdown:", dropdown);
  console.log("name:", name);

  return (
    <>
      <Nav />
      {/* <Form />

      <Map /> */}
      <Outlet />
      {/* <LandingPage /> */}
      {/* <UserForm />
      <TestRed /> */}
      <Footer />
    </>
  );
}

export default App;
