import React, {useEffect, Suspense} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {useFormik} from 'formik';
import {fetchRelayData, deleteRelayData} from "./relaySlice";
// import {fetchRelayData, deleteRelay} from "../../redux/relay/relayActions";
// import {RootState} from "../../redux/store";



import {Form, Button} from "react-bootstrap";
import RelayCommands from "../RelayCommands/Commands";

// const RelayCommands = React.lazy(() => import('./RelayCommands/Commands'));

function Relay() {
  const relay = useAppSelector((state) => state.relay);
  const dispatch = useAppDispatch();

  const getRelayForm = useFormik({
    initialValues: {
      url: '',
    },
    onSubmit: values => {
      console.log('test')
      console.log(values);
      if (values.url.includes("getaddr")) {
        dispatch(fetchRelayData(values.url));
      }
    },
  });

  useEffect(() => { 
    // const relayUrlFromLocalStorage = localStorage.getItem("relayUrl")!
    // if (relayUrlFromLocalStorage !== null && relayUrlFromLocalStorage.includes("getaddr")) {
      // dispatch(fetchRelayData(relayUrlFromLocalStorage) as any);
    // dispatch}
  }, []);

  return (
    <div>
      {relay.errorMsg ? relay.errorMsg : null}
      {relay.relay.version !== undefined ?
        <div className="row">
          <span>ready: {relay.relay.ready.toString()}</span>
          {/* TODO: extract a RelayData component */}
          <details>
            <summary>Show relay data: <span>{relay.relay.ownerAddress}</span></summary>
            {
              Object.keys(relay.relay).map((x, i) => {
                return <div key={i}>{x}: {'test'}</div>
                // return <div key={i}>{x}: {(relay.relay[x])}</div>
              })
            }
          </details>
          {/* <Suspense fallback={<div>Loading relay controls...</div>}> */}

            <RelayCommands />
          {/* </Suspense> */}
        </div>
        : null}
      <div className="row">
        {relay.relay.version === undefined ?
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
            onClick={() => {dispatch(deleteRelayData())}}
          >Switch</Button>
        }
      </div>
    </div>
  );
}
export default React.memo(Relay);
