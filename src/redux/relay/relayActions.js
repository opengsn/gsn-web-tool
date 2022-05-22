import axios from 'axios';

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
      let relay;
      let res = await axios(relayUrl);
      relay = res['data']
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

