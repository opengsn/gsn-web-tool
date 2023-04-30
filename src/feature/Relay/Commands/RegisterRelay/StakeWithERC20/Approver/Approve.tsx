import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import { useAppDispatch, useAppSelector, useLocalStorage, useStakeManagerAddress } from '../../../../../../hooks'
import { useDefaultStateSwitchers } from '../../registerRelayHooks'

import { TokenContext } from '../TokenContextWrapper'

import iErc20TokenAbi from '../../../../../../contracts/iERC20TokenAbi.json'
import RegistrationInputWithTitle from '../../../../../../components/molecules/RegistrationInputWithTitle'
import { jumpToStep } from '../../registerRelaySlice'
import { Alert } from '../../../../../../components/atoms'
import CopyHash from '../../../../../../components/atoms/CopyHash'
import { HashType } from '../../../../../../types/Hash'
import { RegisterSteps } from '../../RegisterFlowSteps'

interface IProps {
  success: boolean
}

export default function Approver({ success }: IProps) {
  const [approveAmount, setApproveAmount] = useState(ethers.constants.One)
  const dispatch = useAppDispatch()
  const [hash, setHash] = useState<HashType>()
  const [approved, setApproved] = useLocalStorage<boolean>('approved', false)

  const relay = useAppSelector((state) => state.relay.relay)
  const { relayHubAddress } = relay
  const chainId = Number(relay.chainId)
  // TODO: approve amount outstanding
  const { token, account, minimumStakeForToken } = useContext(TokenContext)

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as any

  const fetchAll = async () => {
    await refetchCurrentAllowance().catch(console.error)
    await refetchPrepareApprove().catch(console.error)
  }

  useEffect(() => {
    fetchAll().catch(console.error)
  }, [])

  const {
    data: currentAllowanceData,
    isError: currentAllowanceIsError,
    isLoading: currentAllowanceIsLoading,
    refetch: refetchCurrentAllowance
  } = useContractRead({
    address: token as any,
    abi: iErc20TokenAbi,
    functionName: 'allowance',
    chainId,
    enabled: false,
    args: [account, stakeManagerAddress],
    onSuccess(data) {
      setApproveAmount(minimumStakeForToken?.sub(data as any) ?? ethers.constants.One)
    }
  })

  const {
    config,
    error: prepareApproveTxError,
    isError: prepareApproveTxIsError,
    isLoading: prepareApproveTxIsLoading,
    refetch: refetchPrepareApprove
  } = usePrepareContractWrite({
    address: token as any,
    abi: iErc20TokenAbi,
    functionName: 'approve',
    enabled: false,
    args: [stakeManagerAddress, approveAmount]
  })

  const {
    error: approveTxError,
    isSuccess,
    isLoading,
    write: approve
  } = useContractWrite({
    ...config,
    // ...defaultStateSwitchers,
    onSuccess(data) {
      setHash(data.hash)
      setApproved(true)
    }
  })

  const { isLoading: isLoadingForTransaction } = useWaitForTransaction({
    hash,
    enabled: !(hash == null),
    onSuccess: () => {
      dispatch(jumpToStep(4))
    }
  })

  const createApproveButton = () => {
    return (
      <>
        {!prepareApproveTxIsError && prepareApproveTxError === null && (
          <RegistrationInputWithTitle
            title='This is a short explanatory text about the allowance approval.'
            buttonText='Approve'
            isLoading={isLoading || prepareApproveTxIsLoading || currentAllowanceIsLoading || approve == null}
            isSuccess={isSuccess}
            error={approveTxError?.message}
            isLoadingForTransaction={isLoadingForTransaction}
            onClick={() => {
              console.log(approve)
              approve?.()
            }}
          />
        )}
        {currentAllowanceIsError && <Alert severity='error'>Error fetching token allowance</Alert>}
        {prepareApproveTxIsError && <Alert severity='error'>Error preparing approve transaction. - {prepareApproveTxError?.message}</Alert>}
      </>
    )
  }

  if (success) return <CopyHash copyValue={hash} />

  return createApproveButton()
}
