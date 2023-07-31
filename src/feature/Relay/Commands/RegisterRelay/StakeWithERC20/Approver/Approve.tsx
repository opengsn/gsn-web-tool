/* eslint-disable react/no-unescaped-entities */
import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import { useAppDispatch, useAppSelector, useLocalStorage, useStakeManagerAddress } from '../../../../../../hooks'

import { TokenContext } from '../TokenContextWrapper'

import iErc20TokenAbi from '../../../../../../contracts/iERC20TokenAbi.json'
import RegistrationInputWithTitle from '../../../../../../components/molecules/RegistrationInputWithTitle'
import { jumpToStep } from '../../registerRelaySlice'
import { Alert, Typography } from '../../../../../../components/atoms'
import CopyHash from '../../../../../../components/atoms/CopyHash'
import { HashType, Hashes } from '../../../../../../types/Hash'
import ExplorerLink from '../../ExplorerLink'

interface IProps {
  success: boolean
}

export default function Approver({ success }: IProps) {
  const [hashes, setHashes] = useLocalStorage<Hashes>('hashes', {})
  const hash = hashes.approver as HashType
  const [approveAmount, setApproveAmount] = useState(ethers.constants.One)
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayHubAddress } = relay
  const chainId = Number(relay.chainId)
  const { token, account, minimumStakeForToken } = useContext(TokenContext)

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as any

  const setHash = (hash: HashType) => {
    setHashes((prev) => ({ ...prev, approver: hash }))
  }

  const FetchCurrentAllowance = async () => {
    await refetchCurrentAllowance()
  }

  useEffect(() => {
    FetchCurrentAllowance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (data) => {
      setApproveAmount(minimumStakeForToken?.sub(data as any) ?? ethers.constants.One)
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
    enabled: !!approveAmount,
    args: [stakeManagerAddress, approveAmount]
  })

  const {
    error: approveTxError,
    isSuccess,
    isLoading,
    write: approve
  } = useContractWrite({
    ...config,
    onSuccess(data) {
      setHash(data.hash)
    }
  })

  const { isLoading: isLoadingForTransaction } = useWaitForTransaction({
    hash,
    enabled: !!hash,
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
            warningAlert={
              <>
                If using <b>MetaMask</b>, please do not change the approval amount. Choose "Use Default" to issue the approval
              </>
            }
            isLoadingForTransaction={isLoadingForTransaction}
            onClick={() => {
              approve?.()
            }}
          />
        )}
        {currentAllowanceIsError && (
          <Alert severity='error'>
            <Typography variant='h6' fontWeight={600}>
              Error fetching token allowance
            </Typography>
          </Alert>
        )}
        {prepareApproveTxIsError && (
          <Alert severity='error'>
            <Typography variant='h6' fontWeight={600}>
              Error preparing approve transaction. - {prepareApproveTxError?.message}
            </Typography>
          </Alert>
        )}
      </>
    )
  }

  if (success) {
    return (
      <>
        <CopyHash copyValue={hash} />
        <ExplorerLink params={hash ? `tx/${hash}` : null} />
      </>
    )
  }

  return createApproveButton()
}
