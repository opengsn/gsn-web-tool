import {ethers, providers} from 'ethers';

import {fetchData} from '../data/dataActions';
import type {RootState, AppDispatch} from '../store';

import {MetaMaskInpageProvider} from "@metamask/providers";
import {Address} from "@opengsn/common/dist/types/Aliases";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider
  }
}

const metamaskIsInstalled = window.ethereum && window.ethereum !== undefined && window.ethereum.isMetaMask;

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload: any) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload: any) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload: any) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

const switchChainRequest = () => {
  return {
    type: "SWITCH_CHAIN_REQUEST",
  };
};

const switchChainRequestSuccess = () => {
  return {
    type: "SWITCH_CHAIN_REQUEST_SUCCESS",
  };
};

const switchChainRequestFailed = (payload: any) => {
  return {
    type: "SWITCH_CHAIN_REQUEST_FAILED",
    payload: payload
  };
};

export const switchChain = (chainId: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(switchChainRequest());
    const {ethereum} = window;
    console.log(chainId);
    if (metamaskIsInstalled) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: ethers.utils.hexlify(chainId)}],
        });
      } catch (e: any) {
        if (e.code === 4902) {
          try {
            console.log("try adding chain ID n");
          } catch (e) {
            dispatch(switchChainRequestFailed(e));
          }
        }
        console.log(e);
      }
    }
  }
}

export const connect = () => {
  return async (dispatch: any) => {
    dispatch(connectRequest());
    if (metamaskIsInstalled) {
      const {ethereum} = window;
      const provider = new ethers.providers.Web3Provider(ethereum as any)
      ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        localStorage.setItem("isWalletConnected", "true");
        dispatch(
          connectSuccess({
            account: accounts[0],
            provider: provider
          })
        )
      } catch (err) {
        console.log(err);
        dispatch(connectFailed("Something went wrong."));
      }


    }
    else {
      dispatch(connectFailed("Install Metamask."));
    }
  }
};

export const updateAccount = (account: Address) => {
  return async (dispatch: any) => {
    dispatch(updateAccountRequest({account: account}));
    dispatch(fetchData(account));
  };
};
