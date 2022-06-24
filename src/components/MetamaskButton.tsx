import { useConnect } from "wagmi";
// import {connect} from "./blockchainSlice";
// import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";

import { Button } from "react-bootstrap";

export default function MetamaskButton() {

  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect();

  // useEffect((() => {
  //   const connectWalletOnPageLoad = async () => {
  //     if (localStorage?.getItem('isWalletConnected') === 'true') {
  //     try {

  //       } catch (ex) {
  //         console.log(ex)
  //       }
  //     }
  //   }
  //   connectWalletOnPageLoad()
  // }), [])

  return (
  <div>
      {connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
        >
          Connect with {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isConnecting &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </Button>
      ))}

      {error && <div>{error.message}</div>}
    </div> 
    )
  //     <div className="column">
  //       <div className="col text-center">
  //         <Button className="rounded-pill" onClick={
  //           (e) => {
  //             e.preventDefault();
  //             connect()
  //           }
  //         }>
  //           Connect with MetaMask
  //         </Button>
  //         <br />
  //         <Button className="rounded-pill" onClick={
  //           (e) => {
  //             e.preventDefault();
  //             disconnect()
  //           }
  //         }>
  //           Disconnect
  //         </Button>
  //       </div>
  //     </div>
  //   </div>
  // )
}
