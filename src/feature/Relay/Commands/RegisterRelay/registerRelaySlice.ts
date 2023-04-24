import { AxiosError } from 'axios'
import { constants, ethers, providers } from 'ethers'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../../store'

import iErc20TokenAbi from '../../../../contracts/iERC20TokenAbi.json'
import RelayHub from '../../../../contracts/RelayHub.json'
import StakeManager from '../../../../contracts/StakeManager.json'

import { PingResponse } from '../../../../types/PingResponse'
import { isSameAddress } from '../../../../utils'
import { fetchRelayData } from '../../../Relay/relaySlice'
import { RegisterSteps } from './RegisterFlowSteps'

interface registerState {
  step: RegisterSteps
  status: 'idle' | 'success' | 'error'
}

const initialState: registerState = {
  step: 0,
  status: 'idle'
}

interface validateOwnerInPingResponseParams {
  account: string
  ownerAddress: string
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
  }
)

interface checkIsMintingRequiredParams {
  account: string
  relay: PingResponse
  provider: providers.BaseProvider
  token?: string
}

// step 0 -> 1
export const checkIsMintingRequired = createAsyncThunk<boolean, checkIsMintingRequiredParams, { fulfilledMeta: null }>(
  'register/checkIsMintingRequired',
  async ({ account, relay, provider, token }: checkIsMintingRequiredParams, { fulfillWithValue, rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState // check why checkIsMintingRequired is run
    if (state.register.step > 3) return fulfillWithValue(true, null)
    try {
      const { relayManagerAddress, relayHubAddress } = relay

      const relayHub = new ethers.Contract(relay.relayHubAddress, RelayHub.abi, provider)

      const stakeManagerAddress = await relayHub.getStakeManager()
      const stakeManager = new ethers.Contract(stakeManagerAddress, StakeManager.abi, provider)

      const { tokenFromStakeInfo }: { tokenFromStakeInfo: string } = (await stakeManager.getStakeInfo(relay.relayManagerAddress))[0]
      if (tokenFromStakeInfo === constants.AddressZero || tokenFromStakeInfo === undefined) {
        if (token !== undefined) {
          const tokenContract = new ethers.Contract(token, iErc20TokenAbi, provider)
          const tokenBalance = await tokenContract.balanceOf(account)
          const tokenMinStake = await relayHub.functions.getMinimumStakePerToken(token)
          if (tokenBalance.gte(tokenMinStake[0]) === true) {
            dispatch(validateIsRelayManagerStaked({ relayManagerAddress, relayHubAddress, provider })).catch(console.error)

            return fulfillWithValue(true, null)
          }
        }
        return fulfillWithValue(false, null)
      }

      const stakingTokenBytecode = await provider.getCode(tokenFromStakeInfo)
      const stakingTokenContract = new ethers.Contract(tokenFromStakeInfo, iErc20TokenAbi, provider)

      const accountErc20Balance = await stakingTokenContract.balanceOf(account)
      const minimumStake = await relayHub.functions.getMinimumStakePerToken(tokenFromStakeInfo)
      if (!stakingTokenBytecode.includes('deposit') || accountErc20Balance.gte(minimumStake[0]) === true) {
        dispatch(validateIsRelayManagerStaked({ relayManagerAddress, relayHubAddress, provider })).catch(console.error)
        return fulfillWithValue(true, null)
      } else {
        return fulfillWithValue(false, null)
      }
    } catch (e: any) {
      return rejectWithValue(false)
    }
  }
)

interface validateIsRelayFundedParams {
  account: string
  relay: PingResponse
  provider: providers.BaseProvider
}

// step 1 -> 2
const validateIsRelayFunded = createAsyncThunk<boolean, validateIsRelayFundedParams, { fulfilledMeta: null }>(
  'register/validateIsRelayFunded',
  async ({ account, relay, provider }: validateIsRelayFundedParams, { fulfillWithValue, rejectWithValue, dispatch }) => {
    try {
      const relayManagerBalance = await provider.getBalance(relay.relayManagerAddress)
      if (relayManagerBalance.gt(0)) {
        dispatch(validateOwnerInStakeManager({ account, relay, provider })).catch(rejectWithValue)
        return fulfillWithValue(true, null)
      } else {
        return fulfillWithValue(false, null)
      }
    } catch (error: any) {
      return rejectWithValue('could not fetch relay manager balance')
    }
  }
)

interface validateOwnerInStakeManagerParams {
  account: string
  relay: PingResponse
  provider: providers.BaseProvider
}

export const validateOwnerInStakeManager = createAsyncThunk<boolean, validateOwnerInStakeManagerParams, { fulfilledMeta: null }>(
  'register/validateOwnerInStakeManager',
  async ({ account, relay, provider }: validateOwnerInStakeManagerParams, { fulfillWithValue, rejectWithValue, dispatch }) => {
    try {
      const relayHub = new ethers.Contract(relay.relayHubAddress, RelayHub.abi, provider)
      const stakeManagerAddress = await relayHub.getStakeManager()
      const stakeManager = new ethers.Contract(stakeManagerAddress, StakeManager.abi, provider)
      const { owner } = (await stakeManager.getStakeInfo(relay.relayManagerAddress))[0]
      if (isSameAddress(account, owner)) {
        // dispatch(checkIsMintingRequired({ account, relay, provider })).catch(rejectWithValue)
        return fulfillWithValue(true, null)
      } else {
        return fulfillWithValue(false, null)
      }
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

interface validateIsRelayManagerStakedParams {
  relayManagerAddress: string
  relayHubAddress: string
  provider: providers.BaseProvider
}

// step 1 -> 2 -> 3
export const validateIsRelayManagerStaked = createAsyncThunk<Number, validateIsRelayManagerStakedParams, { fulfilledMeta: null }>(
  'register/validateIsRelayManagerStaked',
  async (
    { relayManagerAddress, relayHubAddress, provider }: validateIsRelayManagerStakedParams,
    { fulfillWithValue, rejectWithValue, dispatch, getState }
  ) => {
    try {
      const relayHub = new ethers.Contract(relayHubAddress, RelayHub.abi, provider)

      await relayHub.verifyRelayManagerStaked(relayManagerAddress)

      // passes? might be that the relay is ready. let's check
      const state = getState() as RootState
      if (state.relay.relay.ready) {
        return fulfillWithValue(6, null)
      }
      dispatch(fetchRelayData(state.relay.relayUrl)).catch(console.error)

      return fulfillWithValue(5, null)
    } catch (error: any) {
      switch (true) {
        case error.message.includes('relay manager not staked'):
          return fulfillWithValue(7, null)
        case error.message.includes('this hub is not authorized by SM'):
          return fulfillWithValue(7, null)
        case error.message.includes('stake amount is too small'):
          return fulfillWithValue(7, null)
        default:
          return rejectWithValue(null)
      }
    }
  }
)

interface fetchRegisterStateParams {
  provider: providers.BaseProvider
  account: string
}

export const fetchRegisterStateData = createAsyncThunk<number, fetchRegisterStateParams, { fulfilledMeta: null }>(
  'register/fetchRegisterStateData',
  async ({ provider, account }, { getState, dispatch, fulfillWithValue, rejectWithValue }) => {
    const state = getState() as RootState
    try {
      const relay = state.relay.relay
      if (relay.ready) {
        return fulfillWithValue(7, null) // relay is ready
      }
      // start the chain of checks
      dispatch(validateIsRelayFunded({ account, relay, provider })).catch(rejectWithValue)
      return fulfillWithValue(0, null)
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message !== '' ? error.response?.data?.message : error.message
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
    highlightStepError(state: registerState) {
      state.status = 'error'
    },
    highlightStepIdle(state: registerState) {
      state.status = 'idle'
    },
    jumpToStep(state: registerState, action: { payload: number, type: string }) {
      state.step = action.payload
    }
  },
  extraReducers: (builder) => {
    // main
    builder.addCase(fetchRegisterStateData.fulfilled, (state, action) => {
      if (action.payload === 5) {
        state.status = 'success'
        state.step = 4
      } else {
        state.step = 0
        state.status = 'idle'
      }
    })
    builder.addCase(fetchRegisterStateData.pending, (state) => {
      state.status = 'idle'
    })
    builder.addCase(fetchRegisterStateData.rejected, (state) => {
      state.status = 'error'
    })

    // owner per config
    builder.addCase(validateOwnerInPingResponse.fulfilled, (state) => {
      state.status = 'idle'
      state.step = 0
    })
    builder.addCase(validateOwnerInPingResponse.pending, (state) => {
      state.status = 'idle'
    })
    builder.addCase(validateOwnerInPingResponse.rejected, (state) => {
      state.status = 'error'
      state.step = 0
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
    // step 0 -> 1
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

    builder.addCase(checkIsMintingRequired.rejected, (state) => {
      state.status = 'idle'
    })

    builder.addCase(checkIsMintingRequired.fulfilled, (state, action) => {
      if (action.payload) {
        state.step = 3
      } else {
        state.step = 2
      }
    })

    // validate hub is authorized
    // move to next step if action is _rejected_
    builder.addCase(validateIsRelayManagerStaked.fulfilled, (state, action) => {
      if (action.payload === 5) {
        // check this line
        state.step = 5
        state.status = 'success'
      } else if (action.payload === 4) {
        state.step = 4
        state.status = 'idle'
      } else {
        state.step = +action.payload // changed to 3 from 2
        state.status = 'idle'
      }
    })
    builder.addCase(validateIsRelayManagerStaked.pending, (state) => {
      if (state.status !== 'success') {
        state.status = 'idle'
      }
    })
    builder.addCase(validateIsRelayManagerStaked.rejected, (state) => {
      state.status = 'idle'
      state.step = 4
    })
  }
})

export const { highlightStepError, highlightStepIdle, jumpToStep } = registerSlice.actions
export default registerSlice.reducer
