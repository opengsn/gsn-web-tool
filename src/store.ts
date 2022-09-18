import { configureStore } from '@reduxjs/toolkit'

import relayReducer from './feature/Relay/relaySlice'
import registerReducer from './feature/Relay/Commands/RegisterRelay/registerRelaySlice'
import networkListReducer from './feature/GsnStatus/networkListSlice'

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
