import React, { createContext, useState, useContext, useEffect } from 'react'
import { useBalance, useContractWrite, useProvider } from 'wagmi'
import { ethers } from 'ethers'

import iErc20TokenAbi from '../../../../../../contracts/iERC20TokenAbi.json'

import { TokenContext } from '../TokenContextWrapper'
import { checkIsMintingRequired, jumpToStep } from '../../registerRelaySlice'
import { useAppDispatch, useAppSelector } from '../../../../../../hooks'
import RegistrationInputWithTitle from '../../../../../../components/molecules/RegistrationInputWithTitle'
import { useDefaultStateSwitchers } from '../../registerRelayHooks'
import { TextFieldType } from '../../../../../../components/atoms/TextField'
import { Typography, VariantType } from '../../../../../../components/atoms'
import { colors } from '../../../../../../theme'
import CopyHash from '../../../../../../components/atoms/CopyHash'

export interface MinterContextInterface {
  mintAmount: ethers.BigNumber
  outstandingMintAmount: ethers.BigNumber | null
  setMintAmount: React.Dispatch<React.SetStateAction<ethers.BigNumber | null>>
}

export const MinterContext = createContext<MinterContextInterface>({} as MinterContextInterface)

interface IProps {
  success: boolean
}

export default function Minter({ success }: IProps) {
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay.relay)
  const currentStep = useAppSelector((state) => state.register.step)
  const [mintAmount, setMintAmount] = useState<ethers.BigNumber | null>(null)
  const [outstandingMintAmount, setOutstandingMintAmount] = useState<ethers.BigNumber | null>(null)
  const [localMintAmount, setLocalMintAmount] = useState<ethers.BigNumber>(ethers.constants.Zero)
  const { token, account, minimumStakeForToken } = useContext(TokenContext)
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const provider = useProvider()
  const [hash, setHash] = useState<string>()

  useEffect(() => {
    if (currentStep === 2) {
      refetch().catch(console.error)
    }
    return () => {
      setMintAmount(minimumStakeForToken)
    }
  }, [minimumStakeForToken, setMintAmount, currentStep])

  const {
    data: tokenBalanceData,
    refetch,
    isError
  } = useBalance({
    address: account as any,
    token: token as any,
    watch: true,
    enabled: false,
    onSuccess: (data) => {
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
    overrides: { value: localMintAmount as any },
    mode: 'recklesslyUnprepared',
    ...defaultStateSwitchers,
    onSuccess(data) {
      setHash(data.hash)
      !isError && dispatch(jumpToStep(3))
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

  if (success) {
    return (
      <>
        <Typography variant={VariantType.XSMALL} color={colors.grey}>
          Mint amount: {ethers.utils.formatEther(localMintAmount)} ETH
        </Typography>
        <CopyHash copyValue={hash} />
      </>
    )
  }

  if (mintAmount === null) return <>mintAmount is null</>

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
        label={`Minting amount (minimum amount ${ethers.utils.formatEther(mintAmount) ?? 'error'} ETH)`}
        onClick={() => {
          mintToken?.()
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
