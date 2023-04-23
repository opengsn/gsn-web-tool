import React from 'react'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { useAppSelector, useStakeManagerAddress } from '../../../../../hooks'
import { useDefaultStateSwitchers } from '../registerRelayHooks'
import StakeManager from '../../../../../contracts/StakeManager.json'
import { Alert, Box, CircularProgress, Typography } from '../../../../../components/atoms'

interface AuthorizeHubProps {
  setListen: React.Dispatch<React.SetStateAction<boolean>>
  listen: boolean
}

export default function AuthorizeHub({ setListen, listen }: AuthorizeHubProps) {
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayHubAddress, relayManagerAddress } = relay
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const chainId = Number(relay.chainId)

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)

  const stakeManagerAddress = stakeManagerAddressData as any

  const {
    config,
    error: authorizeTxError,
    isError
  } = usePrepareContractWrite({
    address: stakeManagerAddress,
    abi: StakeManager.abi,
    functionName: 'authorizeHubByOwner',
    args: [relayManagerAddress, relayHubAddress],
    onSuccess: () => {
      authorizeHub?.()
    }
  })

  const { write: authorizeHub } = useContractWrite({
    ...config,
    ...defaultStateSwitchers,
    onSuccess: (data) => {
      setListen(true)
    }
  })

  const text = listen ? 'Authorizing Hub' : 'Setting relay...'

  return (
    <Box>
      <Typography>{text}</Typography>
      {isError
        ? (
        <Alert severity='error'>
          <Typography>{authorizeTxError?.message}</Typography>
        </Alert>
          )
        : (
        <Box>
          <CircularProgress />
        </Box>
          )}
    </Box>
  )
}
