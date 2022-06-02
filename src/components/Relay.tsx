import React, {Suspense, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from 'formik';
import {fetchRelayData, deleteRelay} from "../redux/relay/relayActions";
import {RootState} from "../redux/store";

import {Collapse, Form, Button} from "react-bootstrap";
import RelayCommands from "./RelayCommands/Commands";

import {providers} from "ethers";

// const RelayCommands = React.lazy(() => import('./RelayCommands'));
// <RelayCommands relay={relay.relay} account={account} web3={web3} /> 

interface RelayProps {
  provider: providers.Web3Provider,
  account: string
}

export default function Relay({provider, account}: RelayProps) {
  const relay = useSelector((state: RootState) => state.relay);
  const dispatch = useDispatch();

  const getRelayForm = useFormik({
    initialValues: {
      url: '',
    },
    onSubmit: values => {
      if (values.url.includes("getaddr")) {
        dispatch(fetchRelayData(values.url) as any);
      }

    },
  });

  useEffect(() => {
    const relayUrlFromLocalStorage = localStorage.getItem("relayUrl")!
    if (relayUrlFromLocalStorage !== null && relayUrlFromLocalStorage.includes("getaddr")) {
      dispatch(fetchRelayData(relayUrlFromLocalStorage) as any);
    }
  }, []);

  return (
    <div>
      {relay.errorMsg ? relay.errorMsg : null}
      {relay.relay.version ?
        <div className="row">
          <details>
            <summary>Show relay data: <span>{relay.relay.ownerAddress}</span></summary>
            {
              Object.keys(relay.relay).map((x, i) => {
                return <div key={i}>{x}: {(relay.relay[x]).toString()}</div>
              })
            }
          </details>
          <RelayCommands provider={provider} account={account} relay={relay.relay} />
        </div>
        : null}
      <div className="row">
        {localStorage.getItem('relayUrl') === null ?
          <div className="col"><Form onSubmit={getRelayForm.handleSubmit}>
            <Form.Label htmlFor="url">Relay URL
              <Form.Control
                id="url"
                name="url"
                type="url"
                onChange={getRelayForm.handleChange}
                value={getRelayForm.values.url}
              />
            </Form.Label>
            <br />
            <Button variant="success" type="submit">Fetch data</Button>
          </Form>
          </div> :
          <Button variant="secondary"
            className="my-2"
            onClick={() => {
              dispatch(deleteRelay());
            }}
          >Switch</Button>
        }
      </div>
    </div>
  );
}


