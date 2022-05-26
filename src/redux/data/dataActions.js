// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

/*
export const fetchAuth = (publicAddress) => {
  return async (dispatch) => {
    dispatch(fetchAuth());
    try {
      let name = 
    }
  }
}
    */
const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      //  let name = await store
      //   .getState()
      //  .blockchain.queryFilter(
      let name = "test";

      dispatch(
        fetchDataSuccess({
          name,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
}
