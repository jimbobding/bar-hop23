import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

import "./reset.css";
import router from "./router";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<PacmanLoader color="#36d7b7" />}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Suspense>
  </React.StrictMode>,
);
