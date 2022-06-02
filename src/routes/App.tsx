import {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

import MetamaskButton from "../components/MetamaskButton";
import Relay from "../components/Relay";

import Container from "react-bootstrap/Container";

export default function App() {

  const blockchain = useSelector((state: RootState) => state.blockchain);

  return (
    <div className="App">
      <Container className="my-1">
        {
          blockchain.account == null ?
            <MetamaskButton />
            :
            <Relay provider={blockchain.provider} account={blockchain.account} />
        }
        {blockchain.errorMsg !== "" ? (
          <p>
            {blockchain.errorMsg}
          </p>
        ) : null}
      </Container>
    </div>
  );
}

