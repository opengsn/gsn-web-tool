import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../redux/store";
import {deleteRelay} from "../redux/relay/relayActions";

import MetamaskButton from "../components/MetamaskButton";
import Relay from "../components/Relay";

import {Container} from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function App() {

  const blockchain = useSelector((state: RootState) => state.blockchain);
    const dispatch = useDispatch();

  useEffect(() => {
  }, []);


  return (
    <div className="App">
      <Container className="my-1">
        {
          blockchain.account == null ?
            <MetamaskButton />
            :
            <div className="row">
              <Relay web3={blockchain.web3} account={blockchain.account} />
              <Button variant="secondary"
                className="my-2"
                onClick={() => {
                  dispatch(deleteRelay());
                }}
              >Switch</Button>
            </div>
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

