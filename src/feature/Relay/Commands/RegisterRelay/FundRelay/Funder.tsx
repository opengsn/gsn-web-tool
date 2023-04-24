import { useAppSelector, useStakeManagerAddress } from '../../../../../hooks'
import React, { useState, createContext } from 'react'
import { Typography, VariantType } from '../../../../../components/atoms'

import FundButton from './FundButton'
import SetOwnerListener from './SetOwnerListener'
import { colors } from '../../../../../theme'
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
  const { relayManagerAddress, relayHubAddress } = relay
  const chainId = Number(relay.chainId)

  const handleChangeFunds = (value: number) => {
    setFunds(value)
  }

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as any

  if (stakeManagerAddress === undefined) {
    return <div>Problem fetching data from RPC. Is wallet connected? Refreshing the page might solve the problem</div>
  }

  if (success ?? false) {
    return (
      <>
        <Typography variant={VariantType.XSMALL} color={colors.grey}>
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
      <SetOwnerListener />
    </FunderContext.Provider>
  )
}
