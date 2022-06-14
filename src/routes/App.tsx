import {useAppSelector} from "../hooks";
// import {RootState} from "../store";
import React, { Suspense } from "react";

import MetamaskButton from "../feature/MetamaskButton";
import Relay from "../feature/Relay/Relay";
import {useAccount} from "wagmi";

import Container from "react-bootstrap/Container";

// const MetamaskButton = React.lazy(() => import('../feature/MetamaskButton'));
export default function App() {

  // const blockchain = useAppSelector((state) => state.blockchain);
  const {data, isLoading, isIdle, isFetching, isRefetching, isError, isSuccess} = useAccount()

  console.log(  isLoading, isIdle, isFetching, isRefetching, isError, isSuccess)
  console.log('App render');
  return (

    <div className="App">
        <Container className="my-1">
          {data !== null ?
          <Relay />
          :
          <MetamaskButton />
          } 
        </Container>
    </div>
  );
}

