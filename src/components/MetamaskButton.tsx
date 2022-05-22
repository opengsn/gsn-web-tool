import {useDispatch} from "react-redux";
import {connect} from "../redux/blockchain/blockchainActions";

import {Button} from "react-bootstrap";

export default function MetamaskButton() {
  const dispatch = useDispatch();

  return (

    <div className="row">
      <div className="column">
        <div className="col text-center">
          <Button className="rounded-pill" onClick={
            (e) => {
              e.preventDefault();
              dispatch(connect() as any);
            }
          }>
            Connect with MetaMask
          </Button>
        </div>
      </div>
    </div>
  )
}
