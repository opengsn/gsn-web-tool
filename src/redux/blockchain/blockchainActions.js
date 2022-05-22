import {ethers} from 'ethers';

import {fetchData} from '../data/dataActions';

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const {ethereum} = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;

    if (metamaskIsInstalled) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      try {
        const accounts = await provider.send("eth_requestAccounts", []);

        dispatch(
          connectSuccess({
            account: accounts[0],
            web3: provider
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

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({account: account}));
    dispatch(fetchData(account));
  };
};
