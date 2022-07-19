import { AxiosError } from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../store'
import { ethers, providers } from 'ethers'

import relayHubAbi from '../../../contracts/relayHub.json'
import stakeManagerAbi from '../../../contracts/stakeManager.json'
import { isSameAddress } from '@opengsn/common/dist/Utils'
import { Address } from '@opengsn/common/dist/types/Aliases'
import { PingResponse } from '@opengsn/common'
import { fetchRelayData } from '../../Relay/relaySlice'

export enum RegisterSteps {
  'Funding relay',
  'Staking with ERC20 token',
  'Authorizing Hub',
  'Relay is ready',
}

interface registerState {
  step: RegisterSteps
  status: 'idle' | 'success' | 'error'
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
const validateIsRelayFunded = createAsyncThunk<boolean, validateIsRelayFundedParams, { fulfilledMeta: null }>(
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

export const validateOwnerInStakeManager = createAsyncThunk<boolean, validateOwnerInStakeManagerParams, { fulfilledMeta: null }>('register/validateOwnerInStakeManager',
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
        dispatch(validateIsRelayManagerStaked({ relayManagerAddress, relayHubAddress, provider }))
          .catch(console.error)
        return fulfillWithValue(true, null)
      } else {
        return fulfillWithValue(false, null)
      }
    } catch (error: any) {
      return rejectWithValue(error)
    }
  })

interface validateIsRelayManagerStakedParams {
  relayManagerAddress: Address
  relayHubAddress: Address
  provider: providers.BaseProvider
}

// step 1 -> 2 -> 3
export const validateIsRelayManagerStaked = createAsyncThunk<Number, validateIsRelayManagerStakedParams, { fulfilledMeta: null }
>('register/validateIsRelayManagerStaked',
  async ({ relayManagerAddress, relayHubAddress, provider }: validateIsRelayManagerStakedParams,
    { fulfillWithValue, rejectWithValue, dispatch, getState }) => {
    try {
      const relayHub = new ethers.Contract(relayHubAddress, relayHubAbi, provider)
      const test = await relayHub.verifyRelayManagerStaked(relayManagerAddress)
      // passes? might be that the relay is ready. let's dispatch a check
      const state = getState() as RootState
      dispatch(fetchRelayData(state.relay.relayUrl)).catch(console.error)

      return fulfillWithValue(3, null)
    } catch (error: any) {
      console.log(error)
      if (error.message.includes('relay manager not staked') === true) {
        return fulfillWithValue(1, null)
      }
      if (error.message.includes('this hub is not authorized by SM') === true) {
        return fulfillWithValue(2, null)
      }
      return rejectWithValue(null)
    }
  })

interface fetchRegisterStateParams {
  provider: providers.BaseProvider
  account: Address
}

export const fetchRegisterStateData = createAsyncThunk<number, fetchRegisterStateParams, { fulfilledMeta: null }
>('register/fetchRegisterStateData',
  async ({ provider, account }, { getState, dispatch, fulfillWithValue, rejectWithValue }) => {
    const state = getState() as RootState
    try {
      const relay = state.relay.relay
      if (relay.ready) {
        return fulfillWithValue(3, null)
      }
      // start the chain of checks
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
    highlightStepError (state: registerState) {
      state.status = 'error'
    },
    highlightStepIdle (state: registerState) {
      state.status = 'idle'
    }
  },
  extraReducers: (builder) => {
    // main
    builder.addCase(fetchRegisterStateData.fulfilled, (state, action) => {
      if (action.payload === 3) {
        state.status = 'success'
        state.step = 3
      } else {
        state.step = 0
        state.status = 'idle'
      }
    })
    builder.addCase(fetchRegisterStateData.pending, (state, action) => {
      state.status = 'idle'
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
      state.status = 'idle'
    })
    builder.addCase(validateOwnerInPingResponse.rejected, (state, action) => {
      state.status = 'error'
      state.step = 1
    })

    // check relay manager balance
    // a small check before running the validation that takes step 1 -> 2
    builder.addCase(validateIsRelayFunded.fulfilled, (state, action) => {
      if (action.payload) {
        state.status = 'idle'
      } else {
        state.step = 0
        state.status = 'idle'
      }
    })
    builder.addCase(validateIsRelayFunded.pending, (state) => {
      state.status = 'idle'
    })
    builder.addCase(validateIsRelayFunded.rejected, (state) => {
      state.status = 'error'
      state.step = 0
    })

    // validate owner per stake manager
    // step 1 -> 2
    builder.addCase(validateOwnerInStakeManager.fulfilled, (state, action) => {
      if (action.payload) {
        state.step = 1
      } else {
        state.step = 0
      }
      state.status = 'idle'
    })
    builder.addCase(validateOwnerInStakeManager.pending, (state) => {
      state.status = 'idle'
      state.step = 0
    })
    builder.addCase(validateOwnerInStakeManager.rejected, (state) => {
      state.status = 'error'
      state.step = 0
    })

    // validate hub is authorized
    // move to next step if action is _rejected_
    builder.addCase(validateIsRelayManagerStaked.fulfilled, (state, action) => {
      if (action.payload === 3) {
        // 'Relay is ready',
        state.step = 3
        state.status = 'success'
      } else if (action.payload === 2) {
        // 'Authorizing Hub',
        state.step = 2
        state.status = 'idle'
      } else {
        // 'Staking with ERC20 token',
        state.step = 1
        state.status = 'idle'
      }
    })
    builder.addCase(validateIsRelayManagerStaked.pending, (state) => {
      state.status = 'idle'
      state.step = 1
    })
    builder.addCase(validateIsRelayManagerStaked.rejected, (state) => {
      state.status = 'idle'
      state.step = 1
    })
  }
})

export const { highlightStepError, highlightStepIdle } = registerSlice.actions
export default registerSlice.reducer
