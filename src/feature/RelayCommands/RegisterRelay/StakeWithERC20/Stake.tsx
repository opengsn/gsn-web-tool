import {useState, useEffect} from "react";
import {ethers, BigNumber} from "ethers";
import {useContractWrite, useWaitForTransaction} from 'wagmi';

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";


import {isSameAddress, sleep} from "@opengsn/common/dist/Utils";
import {constants} from "@opengsn/common/dist/Constants";

import StakeManagerAbi from "../../../../contracts/stakeManager.json";

export default function Stake({token, account, stakeManagerAddress, relayAddress}: any) {

  const stakeValue = ethers.utils.parseEther("1.0")
  const {data: stakeRelayerData, isError, isLoading, write: stakeRelayer} = useContractWrite(
    {
      addressOrName: stakeManagerAddress,
      contractInterface: StakeManagerAbi,
    },
    'stakeForRelayManager',
    {args: [token, relayAddress, "15000", stakeValue]}
  )
  const {data: waitForStakeRelayerData, isSuccess} = useWaitForTransaction({
    hash: stakeRelayerData?.hash,
    onSuccess(data) {
      console.log(data)
    }
  })

  // const stakeParam = BigNumber.from((toNumber("1.0") * Math.pow(10, tokenDecimals)).toString())

  // if (unstakeDelay.gte(BigNumber.from("15000")) && stake.gte(stakeParam) === false) {
  //   console.log('Relayer already staked')
  //   const stakeValue = stakeParam.sub(stake)
  //   // console.log(`Staking relayer ${formatToken(stakeValue)}`,
  //   //   stake.toString() === '0' ? '' : ` (already has ${formatToken(stake)})`)
  // } else {
  //   const config = await relayHub.getConfiguration()
  //   if (minimumStakeForToken.gt(BigNumber.from(stakeParam.toString()))) {
  //     throw new Error(`Given stake ${formatToken(stakeParam)} too low for the given hub ${formatToken(minimumStakeForToken)} and token ${stakingToken}`)
  //   }
  //   if (minimumStakeForToken.eq(BigNumber.from('0'))) {
  //     throw new Error(`Selected token (${stakingToken}) is not allowed in the current RelayHub`)
  //   }
  //   if (config.minimumUnstakeDelay.gt(BigNumber.from("15000"))) {
  //     throw new Error(`Given minimum unstake delay ${"15000".toString()} too low for the given hub ${config.minimumUnstakeDelay.toString()}`)
  //   }
  //   const stakeValue = stakeParam.sub(stake)
  //   console.log(`Staking relayer ${formatToken(stakeValue)}`,
  //     stake.toString() === '0' ? '' : ` (already has ${formatToken(stake)})`)

  //   const currentAllowance = await stakingTokenContract.allowance(account, stakeManager.address)
  //   console.log('Current allowance', formatToken(currentAllowance))
  //   if (currentAllowance.lt(stakeValue)) {
  //     console.log(`Approving ${formatToken(stakeValue)} to StakeManager`)
  //     const approveTx = await stakingTokenContract.approve(stakeManager.address, stakeValue, {
  //       from: account
  //     })
  //     approveTx.wait(2);
  //     transactions.push(approveTx.transactionHash)
  //   }

  //   const stakeTx = await stakeManager.connect(signer)
  //     .stakeForRelayManager(stakingToken, relayAddress, "15000".toString(), stakeValue, {
  //       from: account
  //     })
  //   // @ts-ignore
  //   transactions.push(stakeTx.transactionHash)
  // }

  // }


  if (isError) return <div>Tx error / refused</div>
  if (isLoading) return <Button><Spinner animation="border"></Spinner></Button> 
  if (isSuccess) return <div>Relayer successfully staked</div>
  return (
    <div>
      {/* {BigNumber.from(bal).gt(ethers.utils.parseEther("1.0")) ? */}
      <Button onClick={() => stakeRelayer()} className="my-2">
        Approve and stake with WETH
      </Button>
    </div>
  )
}
