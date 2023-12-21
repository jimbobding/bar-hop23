import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../index";

const selectUserState = (state: RootState) => state.user;

export const selectUserName = createSelector(
  [selectUserState],
  (userState) => userState.name,
);
