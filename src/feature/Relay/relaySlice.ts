import {ethers} from "ethers";
import axios from 'axios';
import {createAsyncThunk, createSlice, Reducer, AnyAction} from '@reduxjs/toolkit'


interface RelayData {
  relayWorkerAddress: string;
  relayManagerAddress: string;
  relayHubAddress: string;
  ownerAddress: string;
  minMaxPriorityFeePerGas: string;
  maxAcceptanceBudget: string;
  chainId: string;
  networkId: string;
  ready: Boolean;
  version: string | undefined;
}

interface RelayState {
  relay: RelayData,
  errorMsg: string
}

const initialState = {
  relay: {
  },
  errorMsg: "",
} as RelayState;

export const fetchRelayData = createAsyncThunk(
  'relay/getaddrRequest',
  async (relayUrl: string, thunkAPI) => {
    let relay;
    // const provider = thunkAPI.getState().blockchain.provider;
    let response = await axios(relayUrl);
    console.log('bb');
    // const {chainId} = await provider.getNetwork()
    relay = response['data']
    // if (relay.chainId !== chainId.toString()) {
    //   dispatch(getAddrFailed(<div>Wrong network.
    //       < br />
    //     <button onClick={handleChainSwitch(relay.chainId)}>
    //       Switch to chain ID #{relay.chainId}
    // </button>
    //   < /div>));
    // throw new Error(`wrong chain-id: Relayer on (${relay.chainId}) but our provider is on (${chainId})`)
    // }
    // relay.relayWorkerBalance = ethers.utils.formatEther(await provider.getBalance(relay.relayWorkerAddress))
    // relay.relayManagerBalance = ethers.utils.formatEther(await provider.getBalance(relay.relayManagerAddress))

    // const relayHub = new ethers.Contract(relay.relayHubAddress, relayHubAbi, provider);
    // relay.relayHub = relayHub;

    // const stakeManagerAddress = await relayHub.getStakeManager();
    // relay.stakeManagerAddress = stakeManagerAddress;

    // const stakeManager = new ethers.Contract(stakeManagerAddress, stakeManagerAbi, provider);
    // relay.stakeManager = stakeManager;

    // const {stake, unstakeDelay, token} = (await stakeManager.getStakeInfo(relay.relayManagerAddress))[0]
    // relay = {...relay, stake, unstakeDelay, token}

    // relay.bal = await provider.getBalance(relay.relayManagerAddress);

    localStorage.setItem("relayUrl", relayUrl);

    console.log(relay);
    return {relay};



    // const response = await userAPI.fetchById(userId)
    // return response.data
  }
)

export const deleteRelayData = createAsyncThunk(
  'relay/delete',
  async (thunkAPI) => {
    const relay = {
      version: false
    }
  }
)

const relaySlice = createSlice({
  name: 'relay',
  initialState,
  reducers: {
    fetchRelayDataSuccess(state) {
      state.errorMsg = "";
    },
    fetchRelayDataFailed(state) {
      state.errorMsg = "Something went wrong";
    },

  },
  extraReducers: (builder) => {

    builder.addCase(fetchRelayData.fulfilled, (state, action) => {
      state.relay = action.payload.relay
    });
    builder.addCase(deleteRelayData.fulfilled, (state) => {
      state.relay.version = undefined;
    })

  }

})

// const relayReducer: Reducer<{}> = (state = initialState, action: AnyAction) => {
//   switch (action.type) {
//     case "GET_ADDR__REQUEST":
//       return {
//         ...initialState,
//       };
//     case "GET_ADDR_SUCCESS":
//       return {
//         ...state,
//         relay: action.payload.relay,
//       };
//     case "GET_ADDR_FAILED":
//       return {
//         ...initialState,
//         errorMsg: action.payload,
//       };
//     case "DEL_RELAY_DATA":
//       return {
//         ...initialState,
//         relay: {}
//       }
//     default:
//       return state;
//   }
// };


export const {fetchRelayDataSuccess, fetchRelayDataFailed} = relaySlice.actions;
export default relaySlice.reducer;

// export default relayReducer;


