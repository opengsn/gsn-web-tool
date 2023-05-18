import { useAppSelector, useStakeManagerAddress } from '../../../../../hooks'
import React, { useState, useEffect } from 'react'
import { Alert, Typography } from '../../../../../components/atoms'

import FundButton from './FundButton'
import SetOwnerListener from './SetOwnerListener'
import CopyHash from '../../../../../components/atoms/CopyHash'
import { HashType } from '../../../../../types/Hash'
import ExplorerLink from '../ExplorerLink'

interface IProps {
  success?: boolean
}

export default function Funder({ success }: IProps) {
  const [listen, setListen] = useState(false)
  const [funds, setFunds] = useState<number>(0.5)
  const [hash, setHash] = useState<HashType>()
  const relay = useAppSelector((state) => state.relay.relay)
  const currentStep = useAppSelector((state) => state.register.step)
  const { relayManagerAddress, relayHubAddress } = relay
  const chainId = Number(relay.chainId)
  const { data: stakeManagerAddressData, refetch } = useStakeManagerAddress(relayHubAddress, chainId)

  useEffect(() => {
    if (currentStep === 0) {
      refetch().catch(console.error)
    }
  }, [])

  const handleChangeFunds = (value: number) => {
    setFunds(value)
  }

  const stakeManagerAddress = stakeManagerAddressData as any

  if (stakeManagerAddress === undefined) {
    return <Alert severity='error'>Problem fetching data from RPC. Is wallet connected? Refreshing the page might solve the problem</Alert>
  }

  if (success ?? false) {
    return (
      <>
        <Typography variant='body2' color={'grey.600'}>
          Relay funded with {funds} ETH
        </Typography>
        <CopyHash copyValue={hash} />
        <ExplorerLink params={hash ? `tx/${hash}` : null} />
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
      />
      {currentStep === 0 && (
        <SetOwnerListener
          chainId={chainId}
          listen={listen}
          setListen={setListen}
          stakeManagerAddress={stakeManagerAddress}
          relayManagerAddress={relayManagerAddress}
        />
      )}
    </>
  )
}
