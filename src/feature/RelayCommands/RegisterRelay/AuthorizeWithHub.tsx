import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import Button from "react-bootstrap/Button";

import {useAppSelector} from "../../../hooks";

import {useContractRead, useContract, useContractWrite} from "wagmi";

import relayHubAbi from "../../../contracts/relayHub.json";
import StakeManagerAbi from "../../../contracts/stakeManager.json";

export default function AuthorizeWithHub() {
  // const signer = useSelector((state: RootState) => state.blockchain.provider.getSigner());
  // const account = useSelector((state: RootState) => state.blockchain.account);
  const relay = useAppSelector((state) => state.relay.relay);
  // const dispatch = useDispatch(); 
  const [relayManagerAuthrozed, setRelayManagerAuthorized] = useState(false);

  const relayAuthorized = false;
  const {
    relayManagerAddress,
    relayHubAddress,
  } = relay;

  const {data: stakeManagerAddressData} = useContractRead({
    addressOrName: relayHubAddress,
    contractInterface: relayHubAbi
  }, 'getStakeManager');

  const stakeManagerAddress = stakeManagerAddressData as unknown as string;

  const {data: relayHub} = useContract({
    addressOrName: relayHubAddress,
    contractInterface:relayHubAbi
  })

  // const {data, isError, isSuccess} = useContractRead({
  //   addressOrName: relayHubAddress,
  //   contractInterface: relayHubAbi,
  // }, 'verifyRelayManagerStaked',
  //   {
  //     watch: true,
  //     args: [relayManagerAddress],
  //     onSuccess(data) {
  //       console.log(data);
  //       setRelayManagerAuthorized(true);
  //     },
  //     onError(error) {
  //       console.log(error);
  //       if (error.message.match(/not authorized/) == null) {
  //         console.log('verifyRelayManagerStaked reverted with:', error.message)
  //       }
  //       if (error.message.match(/not staked/) == null) {

  //         console.log(error);
  //       }


  //     },
  //     onSettled(data) {
  //       console.log(data);
  //     }
  //   }
  // )

  useEffect(() => {
    if (relayHub !== undefined) {
     authorizeHub();
    }
  }, [relayHub])

  const authorizeHub = async () => {
    try {
      console.log(relayManagerAddress);
      await relayHub.verifyRelayManagerStaked(relayManagerAddress)
      console.log('Relayer already authorized')
      setRelayManagerAuthorized(true);
    } catch (e: any) {
      // hide expected error
      if (e.message.match(/not authorized/) == null) {
        console.log('verifyRelayManagerStaked reverted with:', e.message)
      }
    }
  }

  const AuthorizeButton = () => {
    const {data: authorizeTxData, isError, isLoading, write: authorizeHub} = useContractWrite(
      {
        addressOrName: stakeManagerAddress,
        contractInterface: StakeManagerAbi,
      },
      'authorizeHubByOwner',
      {args: [relayManagerAddress, relayHubAddress]}
    )
    return (
      <>
        {relayManagerAuthrozed ?
          <div>Relay already authorized</div>
          :
          <>
            <Button onClick={() => authorizeHub()}>AuthorizeWithHub</Button>
          </>
        }
      </>
    )
  }

  return (
    <div>
      <h5>Authorize with Hub:</h5>
      <AuthorizeButton />
    </div>
  )

}
