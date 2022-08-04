import axios, { AxiosError } from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { PingResponse } from '@opengsn/common'

interface RelayState {
  relay: PingResponse
  relayUrl: string
  errorMsg: string
}

const initialState = {
  relay: {},
  relayUrl: '',
  errorMsg: ''
} as RelayState

export const fetchRelayData = createAsyncThunk(
  'relay/getaddrRequest',
  async (relayUrl: string, thunkAPI) => {
    try {
      const response = await axios.get(relayUrl, {
        signal: thunkAPI.signal
      })

      const relay = response.data

      return { relay }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const message = (error.response?.data?.message !== '')
          ? error.response?.data?.message
          : error.message
        return thunkAPI.rejectWithValue(message)
      }
      throw new Error(error)
    }
  }
)

const relaySlice = createSlice({
  name: 'relay',
  initialState,
  reducers: {
    deleteRelayData (state: RelayState) {
      state.relay = initialState.relay
      state.errorMsg = ''
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRelayData.fulfilled, (state, action) => {
      if (state.relay.ready !== undefined && !state.relay.ready && action.payload.relay.ready === true) {
        toast.success('Relay is ready')
      }
      state.errorMsg = ''
      state.relayUrl = action.meta.arg
      state.relay = action.payload.relay
    })
    builder.addCase(fetchRelayData.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.errorMsg = ''
      } else {
        state.errorMsg = `Something went wrong. ${action.error.message as string}`
      }
    })
  }
})

export const { deleteRelayData } = relaySlice.actions
export default relaySlice.reducer
