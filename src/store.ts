import { configureStore } from '@reduxjs/toolkit'

import relayReducer from './feature/Relay/relaySlice'
import registerReducer from './feature/RelayCommands/RegisterRelay/registerRelaySlice'

const reducer = {
  relay: relayReducer,
  register: registerReducer
}

const store = configureStore({
  reducer: reducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
