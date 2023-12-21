import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import App from "./App";
import PageWrapper from "./components/common/PageWrapper";

const LandingPage = React.lazy(() => import("./components/LandingPage"));
const About = React.lazy(() => import("./components/About"));
const FormMap = React.lazy(() => import("./components/FormMap"));
const GeoLocationFormMap = React.lazy(
  () => import("./components/GeoLocation-map/GeoLocationFormMap"),
);
const WaypointFormMap = React.lazy(
  () => import("./components/WayPoint-map/WaypointFormMap"),
);
const Login = React.lazy(() => import("./components/Login"));
const Registration = React.lazy(() => import("./components/Registration"));

export const enum PageRoutes {
  LandingPage = "/",
  About = "/about",
  Form = "/form",
  FormMap = "/formMap",
  GeoLocationMap = "/geoMap",
  GeoLocationFormMap = "/GeoLocationFormMap",
  WaypointMap = "/waypointMap",
  MapWithDirections = "/mapwithdirections",
  WaypointFormMap = "WaypointFormMap",
  Login = "Login",
  Registration = "Registration",
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={PageRoutes.LandingPage} element={<App />}>
      <Route index element={<PageWrapper page={<LandingPage />} />} />
      <Route
        path={PageRoutes.About}
        element={<PageWrapper page={<About />} />}
      />
      <Route
        path={PageRoutes.FormMap}
        element={<PageWrapper page={<FormMap />} />}
      />
      <Route
        path={PageRoutes.GeoLocationFormMap}
        element={<PageWrapper page={<GeoLocationFormMap />} />}
      />

      <Route
        path={PageRoutes.WaypointFormMap}
        element={<PageWrapper page={<WaypointFormMap />} />}
      />
      <Route
        path={PageRoutes.Login}
        element={<PageWrapper page={<Login />} />}
      />
      <Route
        path={PageRoutes.Registration}
        element={<PageWrapper page={<Registration />} />}
      />
    </Route>,
  ),
);

export default router;
