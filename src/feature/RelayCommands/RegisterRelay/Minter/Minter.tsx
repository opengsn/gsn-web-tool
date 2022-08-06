import React, { createContext, useState, useContext } from 'react'
import { useBalance, useContractRead } from 'wagmi'
import { ethers } from 'ethers'

import Card from 'react-bootstrap/Card'

/* import MintButton from './MintButton' */
/* import MintAmountForm from './MintAmountForm' */

import { useStakeManagerAddress, useAppSelector } from '../../../../hooks'

import stakeManagerAbi from '../../../../contracts/stakeManager.json'

export default function Minter () {
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayManagerAddress, relayHubAddress } = relay

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress)
  const stakeManagerAddress = stakeManagerAddressData as unknown as string
  /* const [mintAmount, setMintAmount] = useState<ethers.BigNumber | null>(null) */
  /* const [outstandingMintAmount, setOutstandingMintAmount] = useState<ethers.BigNumber | null>(null) */

  const { data: stakeInfo } = useContractRead({
    addressOrName: stakeManagerAddress,
    contractInterface: stakeManagerAbi,
    args: relayManagerAddress,
    functionName: 'getStakeInfo',
    watch: false
  })

  /* useBalance({ */
  /*   addressOrName: account, */
  /*   token: token, */
  /*   onSuccess (data) { */
  /*     const outstandingTokenAmountCalculated = minimumStakeForToken.sub(data.value) */
  /*     if (mintAmount === ethers.constants.Zero) setMintAmount(outstandingTokenAmountCalculated) */
  /*     setOutstandingMintAmount(outstandingTokenAmountCalculated) */
  /*     setMintAmount(outstandingTokenAmountCalculated) */
  /*   } */
  /* }) */

  return (
    <Card>
      <span>hi</span>
    </Card>
  )
}
