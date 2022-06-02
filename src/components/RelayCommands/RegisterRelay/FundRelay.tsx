import {ethers, BigNumber} from "ethers";

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


  return (
    <>
      <h5>Funding Relay:</h5>
      {(BigNumber.from(bal).gt(BigNumber.from(Number("1.0")))) ?
        <div>- Relay already funded</div>
        : <div>- Relay not yet funded</div> 
      }
      {
        (owner !== constants.ZERO_ADDRESS && !isSameAddress(owner, account)) ?
          <Button onClick={() => fundRelay()}> Fund Relay with 0.5 ETH</Button >
          : <div>- The relay is already owned by {owner}, our account={account}</div>
      }
      <hr />
    </>
  )
}
