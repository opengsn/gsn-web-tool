import { useState, useContext } from 'react'
import { useContractRead, useContractWrite, useNetwork } from 'wagmi'
import { ethers } from 'ethers'
import Button from 'react-bootstrap/Button'

import { TokenContext } from '../StakeWithERC20'
import ErrorButton from '../../../../../components/ErrorButton'
import LoadingButton from '../../../../../components/LoadingButton'

import iErc20TokenAbi from '@opengsn/common/dist/interfaces/IERC20Token.json'
import { useStakeManagerAddress, useAppSelector } from '../../../../../hooks'
import { useDefaultStateSwitchers } from '../../registerRelayHooks'

export default function Approver () {
  const [approveAmount, setApproveAmount] = useState(ethers.constants.One)
  const defaultStateSwitchers = useDefaultStateSwitchers()

  const relay = useAppSelector((state) => state.relay.relay)
  const { relayHubAddress } = relay
  // TODO: approve amount outstanding
  const { token, account, minimumStakeForToken } = useContext(TokenContext)

  const { chain } = useNetwork()

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress)
  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  const { data: currentAllowanceData, isError: currentAllowanceIsError } = useContractRead({
    addressOrName: token,
    contractInterface: iErc20TokenAbi,
    functionName: 'allowance',
    args: [account, stakeManagerAddress],
    onSuccess (data) {
      setApproveAmount(
        minimumStakeForToken.sub(data)
      )
    }
  })

  const { error: approveTxError, isSuccess, isError, isLoading, write: approve } = useContractWrite({
    addressOrName: token,
    contractInterface: iErc20TokenAbi,
    functionName: 'approve',
    args: [stakeManagerAddress, approveAmount],
    onSuccess (data) {
      let infoMsg
      if (chain?.blockExplorers !== undefined) {
        infoMsg = (
          <span>
            Approving token for spend:<br />
            <a href={chain.blockExplorers.default.url + '/' + data.hash}>Block Explorer</a>
          </span>
        )
      } else {
        infoMsg = (
          <span>
            Approving token for spend:<br /><b>{data.hash}</b>
          </span>
        )
      }
    },
    ...defaultStateSwitchers
  })

  const text = <span>Approve token for spend by Relay Manager</span>

  const ApproveError = () => {
    return (
      <ErrorButton message={approveTxError?.message} onClick={() => approve()}>
        {text}
      </ErrorButton>
    )
  }

  const ApproveButton = () => {
    if (currentAllowanceData !== undefined) {
      const text = `Approve for the amount outstanding (${ethers.utils.formatEther(approveAmount)})`
      return <Button onClick={() => approve()}>{text}</Button>
    } else {
      const text = <span>Approve for spend</span>
      return <Button onClick={() => approve()}>{text}</Button>
    }
  }

  if (currentAllowanceIsError) return <span>Error fetching token allowance</span>
  if (isError) return <ApproveError />
  if (isLoading) return <LoadingButton />
  if (isSuccess) return <div>Succesfully increased allowance</div>

  return <ApproveButton />
}
