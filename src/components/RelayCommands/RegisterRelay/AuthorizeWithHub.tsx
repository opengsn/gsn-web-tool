import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";

export default function AuthorizeWithHub({relay, signer, account}: any) {
  const {
    relayManagerAddress,
    relayHubAddress,
    relayHub,
    stakeManager
  } = relay;

  const [relayAuthorized, setRelayAuthorized] = useState(false);

  const authorizeHub = async () => {
    try {
      await relayHub.verifyRelayManagerStaked(relayManagerAddress)
      console.log('Relayer already authorized')
    } catch (e: any) {
      // hide expected error
      if (e.message.match(/not authorized/) == null) {
        console.log('verifyRelayManagerStaked reverted with:', e.message)
      }
      console.log('Authorizing relayer for hub')
      const authorizeTx = await stakeManager.connect(signer)
        .authorizeHubByOwner(relayManagerAddress, relayHubAddress, {from: account})
      // @ts-ignore
      console.log(authorizeTx);
    }
  }

  useEffect(() => {
    relayHub.verifyRelayManagerStaked(relayManagerAddress)
      .then(setRelayAuthorized(true))
      .catch((err: any) => {
        console.log(err);
        setRelayAuthorized(false)
      })
  }, []);

  return (
    <div>
      <h5>Authorize with Hub:</h5>
      {!relayAuthorized ?
        <>
          <Button onClick={() => authorizeHub()}>AuthorizeWithHub</Button>
        </>
        : <div>Relay already authorized</div>
      }
    </div>
  )

}

