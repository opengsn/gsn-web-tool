import { useAppSelector, useStakeManagerAddress } from '../../../../../hooks'
import React, { useState, createContext, useEffect } from 'react'
import { Typography } from '../../../../../components/atoms'

import FundButton from './FundButton'
import SetOwnerListener from './SetOwnerListener'
import CopyHash from '../../../../../components/atoms/CopyHash'

export interface FunderContextInterface {
  funds: number
  listen: boolean
  setListen: React.Dispatch<React.SetStateAction<boolean>>
  relayManagerAddress: string
  stakeManagerAddress: string
  chainId: number
  handleChangeFunds: (value: number) => void
}

export const FunderContext = createContext<FunderContextInterface>({} as FunderContextInterface)

interface IProps {
  success?: boolean
}

export default function Funder({ success }: IProps) {
  const [listen, setListen] = useState(false)
  const [funds, setFunds] = useState<number>(0.5)
  const [hash, setHash] = useState<string>('')
  const relay = useAppSelector((state) => state.relay.relay)
  const currentStep = useAppSelector((state) => state.register.step)
  const { relayManagerAddress, relayHubAddress } = relay
  const chainId = Number(relay.chainId)
  const { data: stakeManagerAddressData, refetch } = useStakeManagerAddress(relayHubAddress, chainId)

  useEffect(() => {
    console.log('in Funder')
    refetch().catch(console.error)
  }, [])

  const handleChangeFunds = (value: number) => {
    setFunds(value)
  }

  const stakeManagerAddress = stakeManagerAddressData as any

  if (stakeManagerAddress === undefined) {
    return <div>Problem fetching data from RPC. Is wallet connected? Refreshing the page might solve the problem</div>
  }

  if (success ?? false) {
    return (
      <>
        <Typography variant='body2' color={'grey.600'}>
          Relay funded with {funds} ETH
        </Typography>
        <CopyHash copyValue={hash} />
      </>
    )
  }

  return (
    <FunderContext.Provider
      value={{
        funds,
        listen,
        setListen,
        relayManagerAddress,
        stakeManagerAddress,
        chainId,
        handleChangeFunds
      }}
    >
      <FundButton setHash={setHash} />
      {currentStep === 0 && <SetOwnerListener />}
    </FunderContext.Provider>
  )
}
