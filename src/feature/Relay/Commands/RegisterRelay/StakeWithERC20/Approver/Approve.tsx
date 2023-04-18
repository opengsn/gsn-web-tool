import { ethers } from 'ethers'
import { useContext, useState } from 'react'
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'

import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'

import { useAppSelector, useStakeManagerAddress } from '../../../../../../hooks'
import { useDefaultStateSwitchers } from '../../registerRelayHooks'

import ErrorButton from '../../../../components/ErrorButton'
import LoadingButton from '../../../../components/LoadingButton'
import TransactionSuccessToast from '../../../../components/TransactionSuccessToast'

import { TokenContext } from '../TokenContextWrapper'

import iErc20TokenAbi from '../../../../../../contracts/iERC20TokenAbi.json'

export default function Approver() {
  const [approveAmount, setApproveAmount] = useState(ethers.constants.One)
  const defaultStateSwitchers = useDefaultStateSwitchers()

  const relay = useAppSelector((state) => state.relay.relay)
  const { relayHubAddress } = relay
  const chainId = Number(relay.chainId)
  // TODO: approve amount outstanding
  const { token, account, minimumStakeForToken } = useContext(TokenContext)

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as any

  const { data: currentAllowanceData, isError: currentAllowanceIsError } = useContractRead({
    address: token as any,
    abi: iErc20TokenAbi,
    functionName: 'allowance',
    chainId,
    args: [account, stakeManagerAddress],
    onSuccess(data) {
      // setApproveAmount(minimumStakeForToken.sub(data as any))
    }
  })

  const {
    config,
    error: prepareApproveTxError,
    isError: prepareApproveTxIsError
  } = usePrepareContractWrite({
    address: token as any,
    abi: iErc20TokenAbi,
    functionName: 'approve',
    args: [stakeManagerAddress, approveAmount]
  })

  const {
    error: approveTxError,
    isSuccess,
    isError,
    isLoading,
    write: approve
  } = useContractWrite({
    ...config,
    ...defaultStateSwitchers,
    onSuccess(data) {
      const text = 'Approved Stake Manager for spend'
      toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
    }
  })

  const createApproveButton = () => {
    const text = <span>Approve token for spend by Relay Manager</span>
    const ApproveButton = () => {
      if (currentAllowanceData !== undefined) {
        const text = `Increase allowance by (${ethers.utils.formatEther(approveAmount)})`
        return <Button onClick={() => approve?.()}>{text}</Button>
      } else {
        return <span>Error fetching token allowance</span>
      }
    }

    const ApproveError = (
      <ErrorButton message={approveTxError?.message} onClick={() => approve?.()}>
        {text}
      </ErrorButton>
    )

    let content
    switch (true) {
      case isError:
        content = ApproveError
        break
      case isSuccess || approveAmount.eq(ethers.constants.Zero):
        content = (
          <div>{"Succesfully increased allowance. 'Stake' button will unlock after the transaction is confirmed by the network"}</div>
        )
        break
      case !prepareApproveTxIsError && prepareApproveTxError === null:
        content = <ApproveButton />
        break
      case currentAllowanceIsError:
        content = <span>Error fetching token allowance</span>
        break
      case prepareApproveTxIsError && prepareApproveTxError !== null:
        content = (
          <div>
            Error preparing approve transaction.
            <span className='bg-warning'>{prepareApproveTxError?.message}</span>
          </div>
        )
        break
      case isLoading:
        content = <LoadingButton />
        break
    }

    if (content === undefined) return <span>unable to initialize approve button</span>
    return content
  }

  return createApproveButton()
}
