import { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";

import HubAuthorizedListener from "./RegisterRelay/HubAuthorizedListener";
import FundRelay from "./RegisterRelay/FundRelay";
import StakeWithERC20 from "./RegisterRelay/StakeWithERC20/StakeWithERC20";
import AuthorizeHub from "./RegisterRelay/AuthorizeHub";

import { useAppSelector } from "../../hooks";

export default function RelayCommands() {
  const relay = useAppSelector((state) => state.relay.relay)

  const [showRegisterRelay, setShowRegisterRelay] = useState(false)
  const [showDeregisterRelay, setShowDeregisterRelay] = useState(false)

  const handleShowRegisterRelay = () => {
    setShowRegisterRelay(!showRegisterRelay)
  };
  const handleShowDeregisterRelay = () => {
    setShowDeregisterRelay(!showDeregisterRelay)
  };

  const DeregisterRelay = () => {
    return (
      <div className="row">
        <Button
          onClick={handleShowDeregisterRelay}
          aria-controls="register-relay-form"
          aria-expanded={showDeregisterRelay}
          variant="danger"
          className="mt-2"
        >
          Deregister
        </Button>
        <Collapse in={showDeregisterRelay}>
          <div className="border p-3" id="register-relay-form">
            <div>WIP</div>
          </div>
        </Collapse>
      </div>
    );
  };

  const RegisterRelay = () => {
    return (
      <div className="row">
        <Button
          onClick={handleShowRegisterRelay}
          aria-controls="register-relay-form"
          aria-expanded={showRegisterRelay}
          className="mt-2"
        >
          Register
        </Button>
        <HubAuthorizedListener />
        {showRegisterRelay ?
          <Collapse in={showRegisterRelay}>
            <div className="border p-3" id="register-relay-form">
              <h5>Fund Relay</h5>
              <FundRelay />
              <hr />
              <h5>Stake with token</h5>
              <StakeWithERC20 />
              <hr />
              <h5>Authorize Hub</h5>
              <AuthorizeWithHub />
            </div>
          </Collapse>
          : null}
      </div>
    );
  };

  return (
    <>
      {
        relay.ready ?
          <DeregisterRelay /> : <RegisterRelay />
      }
    </>
  );
}
