import {ethers, BigNumber} from "ethers";
import {useEffect} from "react";

import {isSameAddress} from "@opengsn/common/dist/Utils";
import {constants} from "@opengsn/common/dist/Constants";

import Button from "react-bootstrap/Button";

export default function FundRelay({relay, signer, account}: any) {
  const {ownerAddress: owner, relayManagerAddress, bal} = relay;

  const fundRelay = async () => {
    const fundTx = await signer.sendTransaction({
      from: account,
      to: relayManagerAddress,
      value: ethers.utils.parseUnits("0.5", "ether").toHexString()
    })

    if (fundTx.hash == null) {
      console.log({
        success: false,
        error: `Fund transaction reverted: ${JSON.stringify(fundTx)}`
      });
      return {
        success: false,
        error: `Fund transaction reverted: ${JSON.stringify(fundTx)}`
      }
    }
  }

  useEffect(() => {
    console.log(relayManagerAddress);
    signer.provider.getBalance(relayManagerAddress).then((res: any) => {console.log(Number(res._hex))})
   }, [])

  return (
    <>
      <h5>Funding Relay:</h5>
      <>

        {console.log(Number(bal))}
        {console.log(Number(BigNumber.from(Number("14114141414.0"))))}
        {console.log(BigNumber.from(bal).gt(BigNumber.from(Number("1.0"))))}
        {(BigNumber.from(bal).gt(BigNumber.from(Number("1.0")))) ?
          <div>- Relay already funded</div>
          :
          <>
            {
              (owner !== constants.ZERO_ADDRESS && !isSameAddress(owner, account)) === false ?
                <>
                  <Button onClick={() => fundRelay()}> Fund Relay with 0.5 ETH</Button >
                </>
                : <div>- The relay is already owned by {owner}, our account={account}</div>
            } 
          </>
        }
      </>
      <hr />
    </>
  )
}
