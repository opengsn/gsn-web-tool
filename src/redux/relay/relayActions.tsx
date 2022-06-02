import axios from 'axios';
import React from 'react';
import {ethers} from 'ethers';

import relayHubAbi from "../../contracts/relayHub.json"
import stakeManagerAbi from "../../contracts/stakeManager.json"

import {switchChain} from "../blockchain/blockchainActions";

import type { AppDispatch } from '../store'

import store from "../store";
const getAddrRequest = () => {
  return {
    type: "GET_ADDR_REQUEST",
  };
};

const getAddrSuccess = (payload: any) => {
  return {
    type: "GET_ADDR_SUCCESS",
    payload: payload,
  };
};

const getAddrFailed = (payload: any) => {
  return {
    type: "GET_ADDR_FAILED",
    payload: payload,
  };
};


export const fetchRelayData = (relayUrl: string) => {
  return async (dispatch: AppDispatch) => {
    const provider = store.getState().blockchain.provider;
    const handleChainSwitch = (chainId: string) => {
      return (e: React.SyntheticEvent) => dispatch(switchChain(chainId));
    }

    dispatch(getAddrRequest());
    try {
      let relay;
      let response = await axios(relayUrl);
      const {chainId} = await provider.getNetwork()
      relay = response['data']
      if (relay.chainId !== chainId.toString()) {
        dispatch(getAddrFailed(<div> Wrong network.
          <br />
          <a href="javascript:void(0);" onClick={handleChainSwitch(relay.chainId)}>
            Switch to chain ID #{relay.chainId}
          </a>
        </div>));
        throw new Error(`wrong chain-id: Relayer on (${relay.chainId}) but our provider is on (${chainId})`)
      }
      relay.relayWorkerBalance = ethers.utils.formatEther(await provider.getBalance(relay.relayWorkerAddress))
      relay.relayManagerBalance = ethers.utils.formatEther(await provider.getBalance(relay.relayManagerAddress))

      const relayHub = new ethers.Contract(relay.relayHubAddress, relayHubAbi, provider);
      const stakeManagerAddress = await relayHub.getStakeManager();

      const stakeManager = new ethers.Contract(stakeManagerAddress, stakeManagerAbi, provider);
      relay.stakeManagerAddress = stakeManagerAddress;
      const {stake, unstakeDelay, token} = (await stakeManager.getStakeInfo(relay.relayManagerAddress))[0]
      relay.stake = stake;
      relay.unstakeDelay = unstakeDelay;
      relay.token = token;

      relay.relayHub = relayHub;
      relay.stakeManager = stakeManager;

      relay.bal = await provider.getBalance(relay.relayManagerAddress);


      /*

      const ver = await relayHub.verifyRelayManagerStaked(relay.relayManagerAddress);

      //     console.log(ver);
      //      const stakingTokenChangedEvent = relayHub.filters.StakingTokenDataChanged();
      //      console.log(await      relayHub.queryFilter(stakingTokenChangedEvent, -4995));

 */
      localStorage.setItem("relayUrl", relayUrl);

      dispatch(
        getAddrSuccess({
          relay
        })
      );
    } catch (err: any) {
      if (err.message.includes('wrong chain-id')) {
        return
      }
      dispatch(getAddrFailed(`${err.name} ${err.message}`));
    }
  };
}
export const deleteRelay = () => {
  localStorage.removeItem("relayUrl");
  return {
    type: "DEL_RELAY_DATA",
  };
}

