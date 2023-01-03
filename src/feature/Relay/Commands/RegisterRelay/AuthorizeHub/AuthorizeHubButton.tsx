import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { useAppSelector, useStakeManagerAddress } from '../../../../../hooks'
import { useDefaultStateSwitchers } from '../registerRelayHooks'
import StakeManagerAbi from '../../../../../contracts/stakeManager.json'

import Button from 'react-bootstrap/Button'

import LoadingButton from '../../../components/LoadingButton'
import ErrorButton from '../../../components/ErrorButton'
import React from 'react'
import TransactionSuccessToast from '../../../components/TransactionSuccessToast'
import { toast } from 'react-toastify'

interface AuthorizeButtonProps {
  setListen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AuthorizeButton ({ setListen }: AuthorizeButtonProps) {
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayHubAddress, relayManagerAddress } = relay
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const chainId = Number(relay.chainId)

  const {
    data: stakeManagerAddressData
  } = useStakeManagerAddress(relayHubAddress, chainId)

  const stakeManagerAddress = stakeManagerAddressData as any

  const { config, error: authorizeTxError, isLoading, isSuccess, isError } = usePrepareContractWrite({
    address: stakeManagerAddress,
    abi: StakeManagerAbi,
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

  function createAuthorizeHubButton () {
    const text = <span>Authorize Hub</span>
    let authorizeButton
    switch (true) {
      case isError:
        authorizeButton = <ErrorButton message={authorizeTxError?.message}>{text}</ErrorButton>
        break
      case isLoading:
        authorizeButton = <LoadingButton />
        break
      case isSuccess:
        authorizeButton = <span>Authorized. Wait before relay is ready</span>
        break
      default:
        <Button onClick={() => authorizeHub?.()}>Authorize Hub</Button>
    }

    if (authorizeButton !== undefined) {
      return authorizeButton
    } else { return <span>error initializing authorize hub button</span> }
  }

  return createAuthorizeHubButton()
}
