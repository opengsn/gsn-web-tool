const initialState = {
  relay: {},
  errorMsg: "",
};

const relayReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ADDR__REQUEST":
      return {
        ...initialState,
      };
    case "GET_ADDR_SUCCESS":
      return {
        ...state,
        relay: action.payload.relay,
      };
    case "GET_ADDR_FAILED":
      return {
        ...initialState,
        errorMsg: action.payload,
      };
    case "DEL_RELAY_DATA":
      return {
        ...initialState,
        relay: {} 
      }
    default:
      return state;
  }
};

export default relayReducer;


