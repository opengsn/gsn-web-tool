// import { applyMiddleware, compose, createStore, combineReducers } from "redux";
// import thunk from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";

// import blockchainReducer from "./blockchain/blockchainReducer";
// import relayReducer from "./relay/relayReducer";
// import stakingTokenDataReducer from "./stakingTokenData/stakingTokenDataReducer";

import relayReducer from "./feature/Relay/relaySlice";

// import blockchainReducer from "./feature/blockchain/blockchainSlice";

// const rootReducer = combineReducers({
//   blockchain: blockchainReducer,
//   relay: relayReducer,
//   stakingTokenData: stakingTokenDataReducer
// });

// const middleware = [thunk];
// const composeEnhancers = compose(applyMiddleware(...middleware));

// const configureStore = () => {
//   return createStore(rootReducer, composeEnhancers);
// };

const reducer = {
  relay: relayReducer
}

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false 
    }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
