import axios, { AxiosError } from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { PingResponse } from '@opengsn/common'

interface RelayState {
  relay: PingResponse
  loading: boolean
  relayUrl: string
  errorMsg: string
}

const initialState = {
  relay: {},
  loading: false,
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
      state.errorMsg = ''
      state.relay = {} as PingResponse
      state.relayUrl = initialState.relayUrl
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
      state.loading = false
    })
    builder.addCase(fetchRelayData.pending, (state) => {
      state.errorMsg = ''
      state.loading = true
    })
    builder.addCase(fetchRelayData.rejected, (state, action) => {
      state.relay = {} as PingResponse
      if (action.error.message === 'Aborted') {
        state.errorMsg = ''
      } else {
        state.errorMsg = `Something went wrong. ${action.error.message as string}`
      }
      state.loading = false
    })
  }
})

export const { deleteRelayData } = relaySlice.actions
export default relaySlice.reducer
