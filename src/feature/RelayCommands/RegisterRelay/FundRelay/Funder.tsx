import { ethers, BigNumber } from 'ethers'
import { useAppSelector, useStakeManagerAddress } from '../../../../hooks'
import React, { useState, createContext } from 'react'

import FundButton from './FundButton'
import SetOwnerListener from './SetOwnerListener'

export interface FunderContextInterface {
  funds: BigNumber
  listen: boolean
  setListen: React.Dispatch<React.SetStateAction<boolean>>
  relayManagerAddress: string
  stakeManagerAddress: string
  chainId: number
}

export const FunderContext = createContext<FunderContextInterface>({} as FunderContextInterface)

export default function Funder () {
  const [listen, setListen] = useState(false)
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayManagerAddress, relayHubAddress } = relay
  const chainId = Number(relay.chainId)

  const funds = BigNumber.from(ethers.utils.parseEther(('0.5')))
  alert(chainId)
  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  return (
    <FunderContext.Provider value={{
      funds,
      listen,
      setListen,
      relayManagerAddress,
      stakeManagerAddress,
      chainId
    }}>
      <FundButton />
      <SetOwnerListener />
    </FunderContext.Provider>
  )
}
