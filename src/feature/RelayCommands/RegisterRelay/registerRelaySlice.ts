import { AxiosError } from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../store'
import { ethers, providers } from 'ethers'

import relayHubAbi from '../../../contracts/relayHub.json'
import stakeManagerAbi from '../../../contracts/stakeManager.json'
import { isSameAddress } from '@opengsn/common/dist/Utils'
import { Address } from '@opengsn/common/dist/types/Aliases'
import { PingResponse } from '@opengsn/common'

export enum RegisterSteps {
  'Funding relay',
  'Staking with ERC20 token',
  'Authorizing Hub',
  'Relay is ready',
}

interface registerState {
  step: RegisterSteps
  status: 'idle' | 'success' | 'error' | 'loading'
}

const initialState: registerState = {
  step: 0,
  status: 'idle'
}

interface validateOwnerInPingResponseParams {
  account: Address
  ownerAddress: Address
}

// step 0
const validateOwnerInPingResponse = createAsyncThunk(
  'register/validateOwnerInPingResponse',
  async ({ account, ownerAddress }: validateOwnerInPingResponseParams, { fulfillWithValue, rejectWithValue }) => {
    try {
      const value = isSameAddress(account, ownerAddress)
      return fulfillWithValue(value)
    } catch (error: any) {
      return rejectWithValue('could not validate owner in /getaddr response')
    }
  })

interface validateIsRelayFundedParams {
  account: Address
  relay: PingResponse
  provider: providers.BaseProvider
}

// step 1 -> 2
const validateIsRelayFunded = createAsyncThunk<boolean,
validateIsRelayFundedParams,
{ fulfilledMeta: null }>(
  'register/validateIsRelayFunded',
  async ({
    account,
    relay,
    provider
  }: validateIsRelayFundedParams, {
    fulfillWithValue,
    rejectWithValue,
    dispatch
  }) => {
    try {
      const relayManagerBalance = await provider.getBalance(relay.relayManagerAddress)
      if (relayManagerBalance.gt(0)) {
        dispatch(validateOwnerInStakeManager({ account, relay, provider }))
          .catch(rejectWithValue)
        return fulfillWithValue(true, null)
      } else {
        return fulfillWithValue(false, null)
      }
    } catch (error: any) {
      return rejectWithValue('could not fetch relay manager balance')
    }
  })

interface validateOwnerInStakeManagerParams {
  account: Address
  relay: PingResponse
  provider: providers.BaseProvider
}

const validateOwnerInStakeManager = createAsyncThunk<boolean,
validateOwnerInStakeManagerParams,
{ fulfilledMeta: null }>(
  'register/validateOwnerInStakeManager',
  async ({
    account,
    relay,
    provider
  }: validateOwnerInStakeManagerParams, {
    fulfillWithValue,
    rejectWithValue,
    dispatch
  }) => {
    try {
      const { relayHubAddress, relayManagerAddress } = relay
      const relayHub = new ethers.Contract(relay.relayHubAddress, relayHubAbi, provider)
      const stakeManagerAddress = await relayHub.getStakeManager()
      const stakeManager = new ethers.Contract(stakeManagerAddress, stakeManagerAbi, provider)
      const { owner } = (await stakeManager
        .getStakeInfo(relay.relayManagerAddress))[0]
      if (isSameAddress(account, owner)) {
         dispatch(validateIsHubAuthorized({ relayManagerAddress, relayHubAddress, provider }))
           .catch(console.error)
        return fulfillWithValue(true, null)
      } else {
        return fulfillWithValue(false, null)
      }
    } catch (error: any) {
      return rejectWithValue(error)
    }
  })

interface validateIsHubAuthorizedParams {
  relayManagerAddress: Address
  relayHubAddress: Address
  provider: providers.BaseProvider
}

// step 3 -> 4
export const validateIsHubAuthorized = createAsyncThunk(
  'register/validateIsHubAuthorized',
  async ({ relayManagerAddress, relayHubAddress, provider }: validateIsHubAuthorizedParams, { fulfillWithValue, rejectWithValue }) => {
    try {
      const relayHub = new ethers.Contract(relayHubAddress, relayHubAbi, provider)
      await relayHub.verifyRelayManagerStaked(relayManagerAddress)
      return fulfillWithValue(null)
    } catch (error: any) {
      // unhandled message
      return rejectWithValue(error.message)
    }
  })

interface fetchRegisterStateParams {
  provider: providers.BaseProvider
  account: Address
}

export const fetchRegisterStateData = createAsyncThunk<number, fetchRegisterStateParams, { fulfilledMeta: null }>(
  'register/fetchRegisterStateData',
  async ({ provider, account }, { getState, dispatch, fulfillWithValue, rejectWithValue }) => {
    const state = getState() as RootState
    try {
      const relay = state.relay.relay
      if (relay.ready) { return fulfillWithValue(4, null) }
      // start the chain
      dispatch(validateIsRelayFunded({ account, relay, provider }))
        .catch(rejectWithValue)
      return fulfillWithValue(1, null)
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const message = (error.response?.data?.message !== '')
          ? error.response?.data?.message
          : error.message
        return rejectWithValue(message)
      }
      throw new Error(error)
    }
  }
)

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    highlightStepError: (state) => {
      state.status = 'error'
    }
  },
  extraReducers: (builder) => {
    // main
    builder.addCase(fetchRegisterStateData.fulfilled, (state, action) => {
      if (action.payload === 4) {
        state.status = 'success'
        state.step = 3
      } else {
        state.status = 'idle'
      }
    })
    builder.addCase(fetchRegisterStateData.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(fetchRegisterStateData.rejected, (state, action) => {
      state.status = 'error'
    })

    // owner per config
    builder.addCase(validateOwnerInPingResponse.fulfilled, (state, action) => {
      state.status = 'idle'
      state.step = 1
    })
    builder.addCase(validateOwnerInPingResponse.pending, (state, action) => {
      state.status = 'loading'
      state.step = 1
    })
    builder.addCase(validateOwnerInPingResponse.rejected, (state, action) => {
      state.status = 'error'
      state.step = 1
    })

    // check relay manager balance
    // step 1 before transitioning to step 2
    builder.addCase(validateIsRelayFunded.fulfilled, (state, action) => {
      if (action.payload) {
        state.step = 1
        state.status = 'loading'
      } else {
        state.step = 0
        state.status = 'idle'
      }
    })
    builder.addCase(validateIsRelayFunded.pending, (state) => {
      state.status = 'loading'
      state.step = 0
    })
    builder.addCase(validateIsRelayFunded.rejected, (state) => {
      state.status = 'error'
      state.step = 0
    })

    // validate owner per stake manager
    // step 1 -> 2
    builder.addCase(validateOwnerInStakeManager.fulfilled, (state, action) => {
      if (action.payload) {
        state.step = 2
      } else {
        state.step = 1
      }
      state.status = 'idle'
    })
    builder.addCase(validateOwnerInStakeManager.pending, (state, action) => {
      state.status = 'loading'
      state.step = 1
    })
    builder.addCase(validateOwnerInStakeManager.rejected, (state, action) => {
      state.status = 'error'
      state.step = 1
    })

    // validate hub is authorized
    // step 3
    builder.addCase(validateIsHubAuthorized.fulfilled, (state, action) => {
      state.step = 3
      state.status = 'success'
    })
    builder.addCase(validateIsHubAuthorized.pending, (state, action) => {
      state.status = 'loading'
      state.step = 2
    })
    builder.addCase(validateIsHubAuthorized.rejected, (state, action) => {
      state.status = 'error'
      state.step = 2
    })
  }
})

export const { highlightStepError } = registerSlice.actions
export default registerSlice.reducer
