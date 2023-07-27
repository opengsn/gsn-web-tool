import React, { useEffect } from 'react'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { useAppSelector, useStakeManagerAddress } from '../../../../../hooks'
import { useDefaultStateSwitchers } from '../registerRelayHooks'
import StakeManager from '../../../../../contracts/StakeManager.json'
import { Alert, Box, CircularProgress, Typography } from '../../../../../components/atoms'

interface AuthorizeHubProps {
  setListen: React.Dispatch<React.SetStateAction<boolean>>
  listen: boolean
  setIsAuthorizeHub: React.Dispatch<React.SetStateAction<boolean>>
  isAuthorizeHub: boolean
}

export default function AuthorizeHub({ setListen, listen, setIsAuthorizeHub, isAuthorizeHub }: AuthorizeHubProps) {
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayHubAddress, relayManagerAddress } = relay
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const chainId = Number(relay.chainId)

  useEffect(() => {
    refetchPrepareContractWrite().catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)

  const stakeManagerAddress = stakeManagerAddressData as any

  const {
    config,
    error: authorizeTxError,
    isError,
    refetch: refetchPrepareContractWrite
  } = usePrepareContractWrite({
    address: stakeManagerAddress,
    abi: StakeManager.abi,
    functionName: 'authorizeHubByOwner',
    enabled: false,
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
      setIsAuthorizeHub(false)
    }
  })

  const text = isAuthorizeHub ? 'Authorizing Hub' : 'Setting relay...'

  return (
    <Box mt={4}>
      <Typography>{text}</Typography>
      {isError
        ? (
        <Alert severity='error'>
          <Typography variant='h6' fontWeight={600}>
            {authorizeTxError?.message}
          </Typography>
        </Alert>
          )
        : (
        <Box mt={4}>
          <CircularProgress />
        </Box>
          )}
    </Box>
  )
}
