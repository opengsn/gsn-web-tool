import { usePrepareContractWrite, useContractWrite, useNetwork } from 'wagmi'
import { useAppSelector, useStakeManagerAddress } from '../../../../hooks'
import { useDefaultStateSwitchers } from '../registerRelayHooks'
import StakeManagerAbi from '../../../../contracts/stakeManager.json'

import Button from 'react-bootstrap/Button'

import LoadingButton from '../../../../components/LoadingButton'
import ErrorButton from '../../../../components/ErrorButton'
import React from 'react'
import TransactionSuccessToast from '../../../../components/TransactionSuccessToast'
import { toast } from 'react-toastify'

interface AuthorizeButtonProps {
  setListen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AuthorizeButton ({ setListen }: AuthorizeButtonProps) {
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayHubAddress, relayManagerAddress } = relay
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const { chain } = useNetwork()

  const {
    data: stakeManagerAddressData
  } = useStakeManagerAddress(relayHubAddress)

  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  const { config, error: authorizeTxError, isLoading, isSuccess, isError } = usePrepareContractWrite({
    addressOrName: stakeManagerAddress,
    contractInterface: StakeManagerAbi,
    functionName: 'authorizeHubByOwner',
    args: [relayManagerAddress, relayHubAddress]
  })

  const { write: authorizeHub } = useContractWrite({
    ...config,
    ...defaultStateSwitchers,
    onSuccess (data) {
      const text = 'Authorized Hub'
      toast.info(<TransactionSuccessToast text={text} hash={data.hash} />)
      setListen(true)
    }
  })

  const text = <span>Authorize Hub</span>

  if (isError) return <ErrorButton message={authorizeTxError?.message}>{text}</ErrorButton>
  if (isLoading) return <LoadingButton />

  if (isSuccess) return <span>Authorized. Wait before relay is ready</span>

  return (
    <Button onClick={() => authorizeHub?.()}>Authorize Hub</Button>
  )
}
