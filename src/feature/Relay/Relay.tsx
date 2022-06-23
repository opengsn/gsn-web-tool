import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useFormik } from "formik";
import { fetchRelayData, deleteRelayData } from "./relaySlice";

import { Form, Button } from "react-bootstrap";

import RelayCommands from "../RelayCommands/Commands";

import { PingResponse } from "@opengsn/common";

function Relay() {
  const relay = useAppSelector((state) => state.relay);
  const dispatch = useAppDispatch();

  const getRelayForm = useFormik({
    initialValues: {
      url: "",
    },
    onSubmit: values => {
      dispatch(fetchRelayData(values.url));
    },
  });

  return (
    <div>
      {relay.errorMsg ? relay.errorMsg : null}
      {relay.relay.version !== undefined ?
        <div className="row">
          {/* TODO: extract a RelayData component */}
          <details>
            <summary>Show relay data: <span>{relay.relay.ownerAddress}</span></summary>
            {
              Object.keys(relay.relay).map((x, i) => {
                return <div key={i}>{x}: {(relay.relay[x as keyof PingResponse])?.toString()}</div>;
              })
            }
          </details>
          <RelayCommands />
          <Button variant="secondary"
            className="my-2"
            onClick={() => dispatch(deleteRelayData())}
          >Switch</Button>
        </div>
        :
        <div className="row">
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
          </div>

        </div>
      }
    </div>
  );
}
export default React.memo(Relay);
