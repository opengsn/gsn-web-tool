import { ethers } from 'ethers'
import { useContext, useState } from 'react'
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'

import { toast } from 'react-toastify'

import { useAppDispatch, useAppSelector, useStakeManagerAddress } from '../../../../../../hooks'
import { useDefaultStateSwitchers } from '../../registerRelayHooks'

import TransactionSuccessToast from '../../../../components/TransactionSuccessToast'

import { TokenContext } from '../TokenContextWrapper'

import iErc20TokenAbi from '../../../../../../contracts/iERC20TokenAbi.json'
import RegistrationInputWithTitle from '../../../../../../components/molecules/RegistrationInputWithTitle'
import { jumpToStep } from '../../registerRelaySlice'
import { Alert } from '../../../../../../components/atoms'

interface IProps {
  success: boolean
}

export default function Approver({ success }: IProps) {
  const [approveAmount, setApproveAmount] = useState(ethers.constants.One)
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const dispatch = useAppDispatch()

  const relay = useAppSelector((state) => state.relay.relay)
  const { relayHubAddress } = relay
  const chainId = Number(relay.chainId)
  // TODO: approve amount outstanding
  const { token, account, minimumStakeForToken } = useContext(TokenContext)

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as any

  const {
    data: currentAllowanceData,
    isError: currentAllowanceIsError,
    isLoading: currentAllowanceIsLoading
  } = useContractRead({
    address: token as any,
    abi: iErc20TokenAbi,
    functionName: 'allowance',
    chainId,
    args: [account, stakeManagerAddress],
    onSuccess(data) {
      if (minimumStakeForToken != null) {
        setApproveAmount(minimumStakeForToken.sub(data as any))
      }
    }
  })

  const {
    config,
    error: prepareApproveTxError,
    isError: prepareApproveTxIsError,
    isLoading: prepareApproveTxIsLoading
  } = usePrepareContractWrite({
    address: token as any,
    abi: iErc20TokenAbi,
    functionName: 'approve',
    args: [stakeManagerAddress, approveAmount]
  })

  const {
    error: approveTxError,
    isSuccess,
    isLoading,
    write: approve
  } = useContractWrite({
    ...config,
    ...defaultStateSwitchers,
    onSuccess(data) {
      const text = 'Approved Stake Manager for spend'
      toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
      !prepareApproveTxIsError && approveTxError == null && !currentAllowanceIsError && dispatch(jumpToStep(4))
    }
  })

  const createApproveButton = () => {
    return (
      <>
        {!prepareApproveTxIsError && prepareApproveTxError === null && (
          <RegistrationInputWithTitle
            title='This is a short explanatory text about the allowance approval.'
            buttonText='Approve'
            isLoading={isLoading || prepareApproveTxIsLoading || currentAllowanceIsLoading}
            isSuccess={isSuccess}
            error={approveTxError?.message}
            onClick={() => approve?.()}
          />
        )}
        {currentAllowanceIsError && <Alert severity='error'>Error fetching token allowance</Alert>}
        {prepareApproveTxIsError && <Alert severity='error'>Error preparing approve transaction. - {prepareApproveTxError?.message}</Alert>}
        {isSuccess || (approveAmount.eq(ethers.constants.Zero) && <>success</>)}
      </>
    )
  }

  if (success) return <></>

  return createApproveButton()
}
