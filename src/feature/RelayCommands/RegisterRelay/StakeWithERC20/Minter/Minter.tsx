import React, { createContext, useState, useContext } from 'react'
import { useBalance } from 'wagmi'
import { ethers } from 'ethers'

import Card from 'react-bootstrap/Card'

import MintButton from './MintButton'
import MintAmountForm from './MintAmountForm'

import { TokenContext } from '../StakeWithERC20'

export interface MinterContextInterface {
  mintAmount: ethers.BigNumber
  outstandingMintAmount: ethers.BigNumber | null
  setMintAmount: React.Dispatch<React.SetStateAction<ethers.BigNumber | null>>
}

export const MinterContext = createContext<MinterContextInterface>({} as MinterContextInterface)

export default function Minter () {
  const [mintAmount, setMintAmount] = useState<ethers.BigNumber | null>(null)
  const [outstandingMintAmount, setOutstandingMintAmount] = useState<ethers.BigNumber | null>(null)
  const { token, account, minimumStakeForToken } = useContext(TokenContext)

  useBalance({
    addressOrName: account,
    token: token,
    onSuccess (data) {
      const outstandingTokenAmountCalculated = minimumStakeForToken.sub(data.value)
      if (mintAmount === ethers.constants.Zero) setMintAmount(outstandingTokenAmountCalculated)
      setOutstandingMintAmount(outstandingTokenAmountCalculated)
      setMintAmount(outstandingTokenAmountCalculated)
    }
  })

  if (mintAmount === null) return <>Calculating mint amount</>

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
