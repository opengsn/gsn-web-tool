// import {RootState} from "../store";
import React from "react";
import { useAccount } from "wagmi";

import MetamaskButton from "../components/MetamaskButton";
import DisconnectButton from "../components/DisconnectButton";
import Relay from "../feature/Relay/Relay";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button"


export default function App() {
  // const { data, error, isLoading, isIdle, isFetching, isRefetching, isError, isSuccess } = useAccount()
  const { data: account, error, isError } = useAccount();

  return (
    <div className="App">
      <Container className="my-1">
        {isError ?
          <span>{error?.message}</span> : <span>{isError}</span>
        }
        {
          account ?
            <>
              <Relay />
              <hr />
              <DisconnectButton />
            </> : <MetamaskButton />
        }
      </Container>
    </div>
  );
}
