import { Address, PingResponse } from '@opengsn/common'
import { compose, createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { ethers } from 'ethers'
import { ChainWithGsn, getNetworks } from '../../networks'
import RelayRegistrarAbi from '../../contracts/relayRegistrar.json'

interface GsnNetworkRelay {
  url: string
  manager: Address
  config?: PingResponse
  errorMsg: string
}

export interface INetwork {
  chain: ChainWithGsn
  group: string
  relays: GsnNetworkRelay[]
  activeRelays: number
  errorMsg: string
}

export interface NetworkListState {
  networks: { [key: number]: INetwork }
  errorMsg: string
  loading: boolean
}

const initialState = {
  networks: {},
  errorMsg: '',
  loading: true
} as NetworkListState

export const fetchNetworks = createAsyncThunk(
  'list/fetchNetworks',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const networks = await getNetworks()
      if (networks === undefined) throw new Error()
      const networksObj: { [key: number]: INetwork } = {}
      for (const network of networks) {
        networksObj[network.id] = { chain: network, relays: [], errorMsg: '', activeRelays: 0, group: network.gsn.group }
        dispatch(fetchRelaysData(network)).catch(console.error)
      }
      return { networks: networksObj, errorMsg: '', loading: false }
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.message)
      }
      return rejectWithValue('unable to fetch networks')
    }
  }
)

interface fetchRelaysDataResponse {
  relays: GsnNetworkRelay[]
  chainId: number
}

export const fetchRelaysData = createAsyncThunk<fetchRelaysDataResponse, ChainWithGsn, { rejectValue: { errorMsg: string, chainId: number } }>(
  'list/fetchRelaysData',
  async (chain: ChainWithGsn, thunkAPI) => {
    // TODO: move to utils.ts
    const { hexStripZeros, toUtf8String, concat } = ethers.utils
    const removeTrailingZeros = (x: string) => x.replace(/(00)*$/, '')
    const removeTrailingSlashes = (url: string) => url.replace(/\/+$/, '')
    const withGetaddr = (url: string) => !/\/getaddr/i.test(url) ? `${url}/getaddr` : url

    const prepareUrl = compose(
      withGetaddr,
      removeTrailingSlashes,
      toUtf8String,
      removeTrailingZeros,
      hexStripZeros,
      concat
    )

    const relays: GsnNetworkRelay[] = []
    try {
      const data = await fetchRelaysFromRegistrar(chain).catch(console.error)

      for (const relayData of data) {
        const url = prepareUrl(relayData.urlParts) as string
        const manager = relayData.relayManager
        try {
          const req = await axios.get(url)
          const config = req.data as PingResponse
          relays.push({
            url,
            manager,
            config,
            errorMsg: ''
          })
        } catch (e) {
          if (e instanceof AxiosError) {
            relays.push({
              url, manager, errorMsg: e.message
            })
          } else {
            relays.push({
              url, manager, errorMsg: 'unknown error trying to reach /getaddr'
            })
          }
        }
      }
      return { relays, chainId: chain.id } as fetchRelaysDataResponse
      // return thunkAPI.fulfillWithValue({ chain, relays })
    } catch (e) {
      // thunkAPI.rejectWithValue('test')
      return thunkAPI.rejectWithValue(
        { errorMsg: 'error fetching data from registrar', chainId: chain.id }
      )
    }
  }
)

const fetchRelaysFromRegistrar = async (chain: ChainWithGsn) => {
  try {
    const { relayHubAddress, RelayHubAbi } = chain.gsn
    const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrls.default)
    const relayHub = new ethers.Contract(relayHubAddress, RelayHubAbi, provider)

    const registrarAddress = await relayHub.getRelayRegistrar()
    const registrar = new ethers.Contract(registrarAddress, RelayRegistrarAbi, provider)

    const data = await registrar.readRelayInfos(relayHubAddress)

    return data
  } catch (e) {
    throw new Error('registrar unreachable')
  }
}

// export const fetchRelaysFromRegistrars = createAsyncThunk(
//   'list/fetchRelaysFromRegistrar',
//   async (chain: ChainWithGsn, thunkAPI) => {
//     try {

//     } catch (e) {

//     }
//   }
// )

// const addRelayToNetworksRelays = (state, action) => {
//   state.networks.relays
// }

const networkListSlice = createSlice({
  name: 'networkList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNetworks.fulfilled, (state, action) => {
      Object.assign(state, action.payload)
      // const networks = action.payload.map((network: ChainWithGsn) => {
      //   const net = { chain: network, relays: [], errorMsg: '' }
      //   return { [network.id]: net }
      // })
      // Object.assign(state.networks, networks)
    })
    builder.addCase(fetchNetworks.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchNetworks.rejected, (state, action) => {
      alert(action.payload)
      state.loading = false
      state.errorMsg = action.payload as string
      state.networks = []
    })
    builder.addCase(fetchRelaysData.fulfilled, (state, action) => {
      state.networks[action.payload.chainId].errorMsg = ''
      state.networks[action.payload.chainId].relays = action.payload.relays
      action.payload.relays.forEach((x) => {
        if (x.config?.ready === true) {
          state.networks[action.payload.chainId].activeRelays++
        }
      })
    })
    builder.addCase(fetchRelaysData.rejected, (state, action) => {
      if (action.payload?.errorMsg === 'registrar unreachable') {
        state.networks[action.payload.chainId].errorMsg = action.payload.errorMsg
      }
      if (action.payload?.chainId !== undefined) {
        state.networks[action.payload.chainId].errorMsg = 'error while reaching registrar'
      }
      // console.error('could not handle error while fetching relay list or data from registrar', action.payload?.errorMsg)
    })
  }
})

export default networkListSlice.reducer
