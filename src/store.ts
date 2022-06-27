import { configureStore } from "@reduxjs/toolkit";

import relayReducer from "./feature/Relay/relaySlice";

const reducer = {
  relay: relayReducer,
};

const store = configureStore({
  reducer: reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
