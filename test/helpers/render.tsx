import { RenderOptions, render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { AppStore, RootState } from "../../src/store";
import { createTestStore } from "./store";

interface RenderOptionsWithStore extends RenderOptions {
  store?: AppStore;
  initialState?: Partial<RootState>;
  route?: string;
}

export function renderComponent(
  el: React.ReactElement,
  {
    initialState = undefined,
    store = createTestStore(initialState),
    route,
    ...options
  }: RenderOptionsWithStore = {},
) {
  if (route) {
    window.history.pushState({}, "Test Page", route);
  }

  function Wrapper({ children }: React.PropsWithChildren) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(el, { wrapper: Wrapper, ...options }),
  };
}
