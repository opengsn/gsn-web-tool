import React, { createContext, useState, useContext } from 'react'
import { useBalance, useProvider } from 'wagmi'
import { ethers } from 'ethers'

import Card from 'react-bootstrap/Card'

import MintButton from './MintButton'
import MintAmountForm from './MintAmountForm'

import { TokenContext } from '../StakeWithERC20'
import { checkIsMintingRequired } from '../../registerRelaySlice'
import { useAppDispatch, useAppSelector } from '../../../../../hooks'

export interface MinterContextInterface {
  mintAmount: ethers.BigNumber
  outstandingMintAmount: ethers.BigNumber | null
  setMintAmount: React.Dispatch<React.SetStateAction<ethers.BigNumber | null>>
}

export const MinterContext = createContext<MinterContextInterface>({} as MinterContextInterface)

export default function Minter () {
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay.relay)
  const [mintAmount, setMintAmount] = useState<ethers.BigNumber | null>(null)
  const [outstandingMintAmount, setOutstandingMintAmount] = useState<ethers.BigNumber | null>(null)
  const { token, account, minimumStakeForToken } = useContext(TokenContext)
  const provider = useProvider()

  useBalance({
    addressOrName: account,
    token: token,
    watch: true,
    onSuccess (data) {
      dispatch(checkIsMintingRequired({ account, provider, relay, token })).catch(console.error)
      const outstandingTokenAmountCalculated = minimumStakeForToken.sub(data.value)
      if (mintAmount === ethers.constants.Zero) setMintAmount(outstandingTokenAmountCalculated)
      setOutstandingMintAmount(outstandingTokenAmountCalculated)
      setMintAmount(outstandingTokenAmountCalculated)
    }
  })

  if (mintAmount === null) return <></>

  return (
    <Card>
      <MinterContext.Provider value={{
        mintAmount: mintAmount,
        outstandingMintAmount: outstandingMintAmount,
        setMintAmount: setMintAmount
      }}>
        <MintAmountForm />
        <MintButton />
      </MinterContext.Provider>
    </Card>
  )
}
