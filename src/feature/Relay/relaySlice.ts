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
      const response = await axios(relayUrl)

      const relay = response.data
      localStorage.setItem('relayUrl', relayUrl)

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

export const deleteRelayData = createAsyncThunk(
  'relay/delete',
  async () => {

  }
)

const relaySlice = createSlice({
  name: 'relay',
  initialState,
  reducers: {
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
      state.errorMsg = `Something went wrong. ${action.error.message as string}`
    })
    builder.addCase(deleteRelayData.fulfilled, (state) => {
      state.errorMsg = ''
      state.relay = initialState.relay
    })
  }
})

export default relaySlice.reducer
