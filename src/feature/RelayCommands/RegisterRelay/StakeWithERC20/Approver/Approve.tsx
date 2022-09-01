import { useState, useContext } from 'react'
import { useContractRead, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi'
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
  const chainId = Number(relay.chainId)
  // TODO: approve amount outstanding
  const { token, account, minimumStakeForToken } = useContext(TokenContext)

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  const { data: currentAllowanceData, isError: currentAllowanceIsError } = useContractRead({
    addressOrName: token,
    contractInterface: iErc20TokenAbi,
    functionName: 'allowance',
    chainId: chainId,
    args: [account, stakeManagerAddress],
    onSuccess (data) {
      setApproveAmount(
        minimumStakeForToken.sub(data)
      )
    }
  })

  const { config, error: prepareApproveTxError } = usePrepareContractWrite({
    addressOrName: token,
    contractInterface: iErc20TokenAbi,
    functionName: 'approve',
    args: [stakeManagerAddress, approveAmount]
  })

  const { error: approveTxError, isSuccess, isError, isLoading, write: approve } = useContractWrite({
    ...config,
    ...defaultStateSwitchers,
    onSuccess (data) {
      const text = 'Approved Stake Manager for spend'
      toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
    }
  })

  const text = <span>Approve token for spend by Relay Manager</span>

  const ApproveError = () => {
    return (
      <ErrorButton message={approveTxError?.message} onClick={() => approve?.()}>
        {text}
      </ErrorButton>
    )
  }

  const ApproveButton = () => {
    if (currentAllowanceData !== undefined) {
      const text = `Increase allowance by (${ethers.utils.formatEther(approveAmount)})`
      return <Button onClick={() => approve?.()}>{text}</Button>
    } else {
      const text = <span>Approve for spend</span>
      return <Button onClick={() => approve?.()}>{text}</Button>
    }
  }

  if (currentAllowanceIsError) return <span>Error fetching token allowance</span>
  if (isError) return <ApproveError />
  if (isLoading) return <LoadingButton />
  if (isSuccess || approveAmount.eq(ethers.constants.Zero)) return <div>Succesfully increased allowance</div>

  return <ApproveButton />
}
