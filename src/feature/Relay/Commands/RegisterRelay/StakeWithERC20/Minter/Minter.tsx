import React, { createContext, useState, useContext } from 'react'
import { useBalance, useProvider, useToken } from 'wagmi'
import { ethers } from 'ethers'

import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import MintButton from './MintButton'
import MintAmountForm from './MintAmountForm'

import { TokenContext } from '../StakeWithERC20'
import { checkIsMintingRequired } from '../../registerRelaySlice'
import { useAppDispatch, useAppSelector } from '../../../../../../hooks'

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

  const { data: tokenData } = useToken({ address: token as any })

  const { data: tokenBalanceData } = useBalance({
    address: account as any,
    token: token as any,
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
    <MinterContext.Provider value={{
      mintAmount,
      outstandingMintAmount,
      setMintAmount
    }}>
      <Tabs defaultActiveKey="basic"
        unmountOnExit={true}
      >
        <span>Available: <b>{tokenBalanceData?.formatted}</b> {tokenData?.symbol}</span>
        <Tab eventKey="basic" title="Basic">
          <MintButton />
        </Tab>
        <Tab eventKey="advanced" title="Advanced (custom amount)">
          <MintAmountForm />
          <MintButton />
        </Tab>
      </Tabs>
    </MinterContext.Provider>
  )
}
