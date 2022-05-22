import React, {Suspense, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from 'formik';
import {fetchRelayData, deleteRelay} from "../redux/relay/relayActions";
import {RootState} from "../redux/store";

import {Collapse, Form, Button} from "react-bootstrap";
import RelayCommands from "./RelayCommands";
// const RelayCommands = React.lazy(() => import('./RelayCommands'));
// <RelayCommands relay={relay.relay} account={account} web3={web3} /> 

export default function Relay(props: any) {
  const relay = useSelector((state: RootState) => state.relay);
  const web3 = props.web3;
  const account = props.account;
  const dispatch = useDispatch();

  const formik = useFormik({
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
          <Button variant="secondary"
            onClick={() => {
              dispatch(deleteRelay());
            }}
          >Switch</Button>
          <RelayCommands relay={relay.relay} account={account} web3={web3} />
        </div>
        : null}
      {localStorage.getItem('relayUrl') === null ?
        <Form onSubmit={formik.handleSubmit}>
          <Form.Label htmlFor="url">Relay URL
            <Form.Control
              id="url"
              name="url"
              type="url"
              onChange={formik.handleChange}
              value={formik.values.url}
            />
          </Form.Label>
          <Button variant="success" type="submit">Fetch data</Button>
        </Form> : null}
    </div>
  );
}


