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
import { toast } from 'react-toastify'
import TransactionSuccessToast from '../../../../../components/TransactionSuccessToast'

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

  const { error: approveTxError, isIdle, isSuccess, isError, isLoading, write: approve } = useContractWrite({
    addressOrName: token,
    contractInterface: iErc20TokenAbi,
    functionName: 'approve',
    args: [stakeManagerAddress, approveAmount],
    onSuccess (data) {
      const text = 'Approved Stake Manager for spend'
      toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
    },
    ...defaultStateSwitchers
  })

  const text = <div>
    <p>Amount to be staked: {ethers.utils.formatEther(approveAmount)}</p>
    <p>Approve token for spend by Relay Manager</p>
  </div>

  const ApproveError = () => {
    return (
      <ErrorButton message={approveTxError?.message} onClick={() => approve()}>
        {text}
      </ErrorButton>
    )
  }

  const ApproveButton = () => {
    if (currentAllowanceData !== undefined) {
      const text = 'Approve'
      return <Button onClick={() => approve()}>{text}</Button>
    } else {
      const text = <span>Approve</span>
      return <Button onClick={() => approve()}>{text}</Button>
    }
  }

  let content
  switch (true) {
    case isError:
      content = <ApproveError />
      break
    case isSuccess:
      content = <div>Succesfully increased allowance</div>
      break
    case isLoading:
      content = <LoadingButton />
      break
    case currentAllowanceIsError:
      content = <span>Error fetching token allowance</span>
      break
    default:
      content = <ApproveButton />
  }

  return <div><>{text}</><>{content}</></div>
}
