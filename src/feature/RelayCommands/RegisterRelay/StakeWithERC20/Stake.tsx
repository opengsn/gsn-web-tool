import { useContext } from 'react'
import { toast } from 'react-toastify'
import { useContractWrite } from 'wagmi'
import { TokenContext } from './StakeWithERC20'

import Button from 'react-bootstrap/Button'
import LoadingButton from '../../../../components/LoadingButton'

import StakeManagerAbi from '../../../../contracts/stakeManager.json'
import { useAppSelector, useStakeManagerAddress } from '../../../../hooks'
import ErrorButton from '../../../../components/ErrorButton'

export default function Stake () {
  const { token, minimumStakeForToken } = useContext(TokenContext)
  const relay = useAppSelector((state) => state.relay.relay)

  const { relayHubAddress, relayManagerAddress } = relay

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress)
  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  // const stakeValue = ethers.utils.parseEther('0.5')
  // const stake
  const text = 'Stake with (token) (value)'
  const unstakeDelay = '15000'

  const { error: stakeTxError, isSuccess, isError, isLoading, write: stakeRelayer } = useContractWrite(
    {
      addressOrName: stakeManagerAddress,
      contractInterface: StakeManagerAbi,
      functionName: 'stakeForRelayManager',
      args: [token, relayManagerAddress, unstakeDelay, minimumStakeForToken],
      onError (err) {
        toast.warn(`Staking error: ${err.message}`)
      },
      onSuccess (data) {
        toast.info(<span>Staked with tx: <br /> <b>{data.hash}</b></span>)
      }
    }
  )

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

  if (isError) return <ErrorButton message={stakeTxError?.message} onClick={() => stakeRelayer()}>{text}</ErrorButton>
  if (isLoading) return <LoadingButton />
  if (isSuccess) return <div>Relayer successfully staked</div>

  return (
    <div>
      {/* {BigNumber.from(bal).gt(ethers.utils.parseEther("1.0")) ? */}
      <Button onClick={() => stakeRelayer()} className="my-2">
        {text}
      </Button>
    </div>
  )
}
