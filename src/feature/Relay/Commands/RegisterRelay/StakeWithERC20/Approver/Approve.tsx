import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'

import { useAppDispatch, useAppSelector, useStakeManagerAddress } from '../../../../../../hooks'
import { useDefaultStateSwitchers } from '../../registerRelayHooks'

import { TokenContext } from '../TokenContextWrapper'

import iErc20TokenAbi from '../../../../../../contracts/iERC20TokenAbi.json'
import RegistrationInputWithTitle from '../../../../../../components/molecules/RegistrationInputWithTitle'
import { jumpToStep } from '../../registerRelaySlice'
import { Alert } from '../../../../../../components/atoms'
import CopyHash from '../../../../../../components/atoms/CopyHash'

interface IProps {
  success: boolean
}

export default function Approver({ success }: IProps) {
  const [approveAmount, setApproveAmount] = useState(ethers.constants.One)
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const dispatch = useAppDispatch()
  const [hash, setHash] = useState<string>('')

  const relay = useAppSelector((state) => state.relay.relay)
  const { relayHubAddress } = relay
  const chainId = Number(relay.chainId)
  // TODO: approve amount outstanding
  const { token, account, minimumStakeForToken } = useContext(TokenContext)

  const { data: stakeManagerAddressData, refetch: refetchStakeManagerAddress } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as any

  const fetchAll = async () => {
    await refetchStakeManagerAddress().catch(console.error)
    await refetchCurrentAllowance().catch(console.error)
    await refetchPrepareApprove().catch(console.error)
  }

  useEffect(() => {
    void fetchAll()
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
      if (minimumStakeForToken != null) {
        setApproveAmount(minimumStakeForToken.sub(data as any))
      }
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
    ...defaultStateSwitchers,
    onSuccess(data) {
      setHash(data.hash)
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
            isLoading={isLoading || prepareApproveTxIsLoading || currentAllowanceIsLoading}
            isSuccess={isSuccess}
            error={approveTxError?.message}
            onClick={() => {
              console.log(approve)
              approve?.()
            }}
          />
        )}
        {currentAllowanceIsError && <Alert severity='error'>Error fetching token allowance</Alert>}
        {prepareApproveTxIsError && <Alert severity='error'>Error preparing approve transaction. - {prepareApproveTxError?.message}</Alert>}
        {isSuccess || (approveAmount.eq(ethers.constants.Zero) && <>success</>)}
      </>
    )
  }

  if (success) return <CopyHash copyValue={hash} />

  return createApproveButton()
}
