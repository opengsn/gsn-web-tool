import {useEffect} from "react";
import {useAccount, useConnect, useDisconnect} from 'wagmi'
// import {connect} from "./blockchainSlice";
import {MetaMaskConnector} from 'wagmi/connectors/metaMask'
import {InjectedConnector} from 'wagmi/connectors/injected'

import {Button} from "react-bootstrap";

export default function MetamaskButton() {

  const {connect} = useConnect({
    connector: new InjectedConnector(),
  })

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


  return <Button onClick={() => connect()}>Connect Wallet</Button>



  // return (
  //   <div className="row">
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
