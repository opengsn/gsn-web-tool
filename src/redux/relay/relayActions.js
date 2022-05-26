import axios from 'axios';
import { ethers } from 'ethers';
import relayHubAbi from "../../components/contracts/relayHub.json"
import store from "../store";

const getAddrRequest = () => {
  return {
    type: "GET_ADDR_REQUEST",
  };
};

const getAddrSuccess = (payload) => {
  return {
    type: "GET_ADDR_SUCCESS",
    payload: payload,
  };
};

const getAddrFailed = (payload) => {
  return {
    type: "GET_ADDR_FAILED",
    payload: payload,
  };
};

export const fetchRelayData = (relayUrl) => {
  return async (dispatch) => {
    dispatch(getAddrRequest());
    try {
     // axios(url).then(res => console.log(res['data']));
      const web3 = store.getState().blockchain.web3; 
      let relay;
      let res = await axios(relayUrl);
      relay = res['data']
//      relay.relayWorkerBalance =  ethers.utils.formatEther(await web3.getBalance(relay.relayWorkerAddress))
//      relay.relayManagerBalance =  ethers.utils.formatEther(await web3.getBalance(relay.relayManagerAddress))

 //     const relayHub = new ethers.Contract(relay.relayHubAddress, relayHubAbi, web3);      
//      const ver =     await relayHub.verifyRelayManagerStaked(relay.relayManagerAddress);
 //     console.log(ver);
//      const stakingTokenChangedEvent = relayHub.filters.StakingTokenDataChanged();
//      console.log(await      relayHub.queryFilter(stakingTokenChangedEvent, -4995));
      

      localStorage.setItem("relayUrl", relayUrl);

      dispatch(
        getAddrSuccess({
          relay,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(getAddrFailed(`${err.message} ${err.name}`));
    }
  };
}
export const deleteRelay = () => {
  localStorage.removeItem("relayUrl");
  return {
    type: "DEL_RELAY_DATA",
  };
}

