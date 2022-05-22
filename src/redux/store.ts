import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import blockchainReducer from "./blockchain/blockchainReducer";
import dataReducer from "./data/dataReducer";
import relayReducer from "./relay/relayReducer";

const rootReducer = combineReducers({
  blockchain: blockchainReducer,
  data: dataReducer,
  relay: relayReducer,
});

const middleware = [thunk];
const composeEnhancers = compose(applyMiddleware(...middleware));

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers);
};

const store = configureStore();

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export default store
