import { useAppSelector, useLocalStorage, useStakeManagerAddress } from '../../../../../hooks'
import React, { useState, useEffect } from 'react'
import { Alert, Typography, Box } from '../../../../../components/atoms'

import FundButton from './FundButton'
import SetOwnerListener from './SetOwnerListener'
import CopyHash from '../../../../../components/atoms/CopyHash'
import { HashType, Hashes } from '../../../../../types/Hash'
import ExplorerLink from '../ExplorerLink'
import { useTheme } from '@mui/material'

interface IProps {
  success?: boolean
}

export default function Funder({ success }: IProps) {
  const [hashes, setHashes] = useLocalStorage<Hashes>('hashes', {})
  const [listen, setListen] = useState(false)
  const theme = useTheme()
  const [funds, setFunds] = useLocalStorage<string>('funds', '0.5')
  const hash = hashes.funder as HashType
  const relay = useAppSelector((state) => state.relay.relay)
  const currentStep = useAppSelector((state) => state.register.step)
  const { relayManagerAddress, relayHubAddress } = relay
  const chainId = Number(relay.chainId)
  const [error, setError] = useState<boolean>(false)
  const { data: stakeManagerAddressData, refetch } = useStakeManagerAddress(relayHubAddress, chainId)

  const setHash = (hash: HashType) => {
    setHashes((prev) => ({ ...prev, funder: hash }))
  }

  useEffect(() => {
    if (currentStep === 0) {
      refetch().catch(console.error)
    }
  }, [currentStep, refetch])

  const handleChangeFunds = (value: string) => {
    setFunds(value)
  }

  const stakeManagerAddress = stakeManagerAddressData as any

  if (stakeManagerAddress === undefined) {
    return (
      <Alert severity='error'>
        <Typography variant='h6'>
          Problem fetching data from RPC. Is wallet connected? Refreshing the page might solve the problem
        </Typography>
      </Alert>
    )
  }

  if (success ?? false) {
    return (
      <>
        <CopyHash copyValue={hash} />
        <ExplorerLink params={hash ? `tx/${hash}` : null} />
        <Box width='100%'>
          <Typography variant='h6' color={theme.palette.primary.mainPos}>
            Relay funded with {funds} ETH
          </Typography>
        </Box>
      </>
    )
  }

  return (
    <>
      <FundButton
        setHash={setHash}
        hash={hash}
        funds={funds}
        handleChangeFunds={handleChangeFunds}
        relayManagerAddress={relayManagerAddress}
        setListen={setListen}
        error={error}
      />
      {currentStep === 0 && (
        <SetOwnerListener
          chainId={chainId}
          listen={listen}
          setListen={setListen}
          stakeManagerAddress={stakeManagerAddress}
          relayManagerAddress={relayManagerAddress}
          setError={setError}
        />
      )}
    </>
  )
}
