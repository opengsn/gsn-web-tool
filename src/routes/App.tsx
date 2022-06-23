// import {RootState} from "../store";
import React from "react";

import MetamaskButton from "../feature/MetamaskButton";
import Relay from "../feature/Relay/Relay";
import { useAccount } from "wagmi";

import Container from "react-bootstrap/Container";

export default function App() {
  // const { data, error, isLoading, isIdle, isFetching, isRefetching, isError, isSuccess } = useAccount()
  const { data, error, isError } = useAccount();

  return (
    <div className="App">

      <Container className="my-1">
        {isError ?
          <span>{error?.message}</span> : <span>{isError}</span>
        }
        {
          data !== undefined ?
            <Relay />
            :
            <MetamaskButton />
        }
      </Container>
    </div>
  );
}
