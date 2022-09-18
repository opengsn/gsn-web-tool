import { configureStore } from '@reduxjs/toolkit'

import relayReducer from './feature/Relay/relaySlice'
import networkListReducer from './feature/RelaysList/networkListSlice'
import registerReducer from './feature/Relay/Commands/RegisterRelay/registerRelaySlice'

const reducer = {
  relay: relayReducer,
  register: registerReducer,
  networkList: networkListReducer
}

const store = configureStore({
  reducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
