import {useEffect, useState} from "react";
import {ethers, BigNumber} from "ethers";
import {useAppSelector, useAppDispatch} from "../../../hooks";

import {useSigner, useAccount, useBalance, useSendTransaction, useWaitForTransaction} from 'wagmi'
import {isSameAddress} from "@opengsn/common/dist/Utils";
import {constants} from "@opengsn/common/dist/Constants";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";


export default function FundRelay() {
  const relay = useAppSelector((state) => state.relay.relay);
  const {ownerAddress: owner, relayManagerAddress} = relay;

  const funds = BigNumber.from(ethers.utils.parseEther(("0.5")))

  const FundButton = () => {
    const {data: fundTxData, isIdle, isError, isLoading, isSuccess, sendTransaction} =
      useSendTransaction({
        request: {
          to: relayManagerAddress,
          value: funds
        },
      })
    const {
      data: waitForFundTxData,
      isError: waitIsError,
      isLoading: waitIsLoading,
      isSuccess: waitIsSuccess
    } = useWaitForTransaction({
      hash: fundTxData?.hash,
    })

    const FundedMessage = () => {
      if (fundTxData !== undefined && waitIsSuccess) {
        console.log(waitForFundTxData);
        return <div>Relayer funded with tx {fundTxData.hash}</div>
      }
      return <div>Fuding relayManagerAddress with tx {fundTxData?.hash}</div>
    }

    return (
      <div>
        {isIdle && (
          <Button disabled={isLoading} onClick={() => sendTransaction()}>
            Fund Relay
          </Button>
        )}
        {isLoading && (
          <Button disabled={isLoading}>
            <Spinner animation="border" role="status"></Spinner>
          </Button>
        )}
        {isSuccess && <FundedMessage />}
        {isError && <div>Error sending transaction</div>}
      </div>
    )
  }

  const Funder = () => {

    let account: string = "unknown";
    const {data: accountData} = useAccount();
    if (accountData?.address !== undefined) {
      account = accountData.address
    }

    const {data: bal} = useBalance({addressOrName: relayManagerAddress, watch: false})

    const isRelayFunded = (bal?.value.gt(funds) === false)
    const isAccountRelayOwner = (owner !== constants.ZERO_ADDRESS && isSameAddress(owner, account))

    return (
      <>
        {isRelayFunded ?
          <>
            {isAccountRelayOwner ?
              <FundButton />
              : <div>- The relay is already owned by {owner}, our data.address={account}</div>
            }
          </>
          : <span>Relay already funded</span>
        }
      </>
    )
  }

  return (
    <>
      <h5>Funding Relay:</h5>
      <Funder />
      <hr />
    </>
  )
}
