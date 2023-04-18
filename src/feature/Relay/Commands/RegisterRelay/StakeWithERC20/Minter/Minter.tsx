import React, { createContext, useState, useContext } from 'react'
import { useBalance, useContractWrite, useProvider } from 'wagmi'
import { ethers } from 'ethers'

import iErc20TokenAbi from '../../../../../../contracts/iERC20TokenAbi.json'

import { TokenContext } from '../TokenContextWrapper'
import { checkIsMintingRequired } from '../../registerRelaySlice'
import { useAppDispatch, useAppSelector } from '../../../../../../hooks'
import RegistrationInputWithTitle from '../../../../../../components/molecules/RegistrationInputWithTitle'
import { useDefaultStateSwitchers } from '../../registerRelayHooks'
import { TextFieldType } from '../../../../../../components/atoms/TextField'

export interface MinterContextInterface {
  mintAmount: ethers.BigNumber
  outstandingMintAmount: ethers.BigNumber | null
  setMintAmount: React.Dispatch<React.SetStateAction<ethers.BigNumber | null>>
}

export const MinterContext = createContext<MinterContextInterface>({} as MinterContextInterface)

export default function Minter() {
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay.relay)
  const [mintAmount, setMintAmount] = useState<ethers.BigNumber | null>(null)
  const [outstandingMintAmount, setOutstandingMintAmount] = useState<ethers.BigNumber | null>(null)
  const [localMintAmount, setLocalMintAmount] = useState(ethers.constants.Zero)
  const { token, account, minimumStakeForToken } = useContext(TokenContext)
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const provider = useProvider()

  const { data: tokenBalanceData } = useBalance({
    address: account as any,
    token: token as any,
    watch: true,
    enabled: !(minimumStakeForToken == null),
    onSuccess: (data) => {
      console.log('account', account, 'token', token, 'minimumStakeForToken', minimumStakeForToken)
      if (account != null && token != null && minimumStakeForToken != null) {
        dispatch(checkIsMintingRequired({ account, provider, relay, token })).catch(console.error)
        const outstandingTokenAmountCalculated = minimumStakeForToken.sub(data.value)
        if (mintAmount === ethers.constants.Zero) setMintAmount(outstandingTokenAmountCalculated)
        setOutstandingMintAmount(outstandingTokenAmountCalculated)
        setMintAmount(outstandingTokenAmountCalculated)
      }
    }
  })

  const {
    error: mintTokenError,
    isLoading,
    isSuccess,
    write: mintToken
  } = useContractWrite({
    address: token as any,
    abi: iErc20TokenAbi,
    functionName: 'deposit',
    overrides: { value: localMintAmount },
    mode: 'recklesslyUnprepared',
    ...defaultStateSwitchers,
    onSuccess(data) {
      console.log('mintToken', data)
    }
  })

  const handleSetMintAmount = (value?: string) => {
    try {
      if (value === undefined) return

      const amountBigNumber = ethers.utils.parseEther(value)
      setLocalMintAmount(amountBigNumber)
    } catch (e: any) {
      // suppress error
    }
  }

  if (mintAmount === null) return <>loading...</>

  if (isSuccess) return <>Success</>

  return (
    <MinterContext.Provider
      value={{
        mintAmount,
        outstandingMintAmount,
        setMintAmount
      }}
    >
      <RegistrationInputWithTitle
        title='Create a new block on the blockchain network that includes your chosen token by inserting minting amount.'
        label={`Minting amount (minimum amount ${minimumStakeForToken?.toString()} ETH)`}
        onClick={() => {
          if (mintAmount !== null) return mintToken?.()
        }}
        onChange={(value) => handleSetMintAmount(value)}
        error={mintTokenError?.message}
        isLoading={isLoading}
        isSuccess={isSuccess}
        type={TextFieldType.Text}
        buttonText='Mint token'
      />
    </MinterContext.Provider>
  )
}
