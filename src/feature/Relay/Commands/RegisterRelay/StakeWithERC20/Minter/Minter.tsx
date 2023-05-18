import React, { useState, useContext, useEffect } from 'react'
import { useBalance, useContractWrite, useProvider, useWaitForTransaction } from 'wagmi'
import { ethers } from 'ethers'

import iErc20TokenAbi from '../../../../../../contracts/iERC20TokenAbi.json'

import { TokenContext } from '../TokenContextWrapper'
import { checkIsMintingRequired, jumpToStep } from '../../registerRelaySlice'
import { useAppDispatch, useAppSelector, useLocalStorage } from '../../../../../../hooks'
import RegistrationInputWithTitle from '../../../../../../components/molecules/RegistrationInputWithTitle'
import { useDefaultStateSwitchers } from '../../registerRelayHooks'
import { TextFieldType } from '../../../../../../components/atoms/TextField'
import { Typography } from '../../../../../../components/atoms'
import CopyHash from '../../../../../../components/atoms/CopyHash'
import { HashType } from '../../../../../../types/Hash'
import ExplorerLink from '../../ExplorerLink'

interface IProps {
  success: boolean
}

export default function Minter({ success }: IProps) {
  const dispatch = useAppDispatch()
  const relay = useAppSelector((state) => state.relay.relay)
  const currentStep = useAppSelector((state) => state.register.step)
  const [mintAmount, setMintAmount] = useState<ethers.BigNumber | null>(null)
  const [localMintAmount, setLocalMintAmount] = useLocalStorage<ethers.BigNumber>('localMintAmount', ethers.constants.One)
  const { token, account, minimumStakeForToken } = useContext(TokenContext)
  const defaultStateSwitchers = useDefaultStateSwitchers()
  const provider = useProvider()
  const [hash, setHash] = useState<HashType>()

  useEffect(() => {
    if (currentStep === 2 && minimumStakeForToken !== null) {
      refetch().catch(console.error)
    }
    return () => {
      setMintAmount(minimumStakeForToken)
    }
  }, [token, minimumStakeForToken])

  useEffect(() => {
    if (mintAmount !== null) {
      setLocalMintAmount(mintAmount)
    }
  }, [mintAmount])

  const { refetch } = useBalance({
    address: account as any,
    token: token as any,
    enabled: false,
    onSuccess: (data) => {
      if (account != null && token != null) {
        dispatch(checkIsMintingRequired({ account, provider, relay, token })).catch(console.error)
      }
      const outstandingTokenAmountCalculated = minimumStakeForToken?.sub(data.value) ?? null
      setMintAmount(outstandingTokenAmountCalculated)
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
      setHash(data.hash)
    }
  })

  const { isLoading: isLoadingForTransaction } = useWaitForTransaction({
    hash,
    enabled: !(hash == null),
    onSuccess: () => {
      dispatch(jumpToStep(3))
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
        <Typography variant='body2' color={'grey.600'}>
          {localMintAmount != null && <>Mint amount: {ethers.utils.formatEther(localMintAmount)} ETH</>}
        </Typography>
        <CopyHash copyValue={hash} />
        <ExplorerLink params={hash ? `tx/${hash}` : null} />
      </>
    )
  }

  return (
    <RegistrationInputWithTitle
      title='Create a new block on the blockchain network that includes your chosen token by inserting minting amount.'
      label={`Minting amount (minimum amount ${mintAmount !== null ? ethers.utils.formatEther(mintAmount) : 'error - '} ETH)`}
      onClick={() => {
        mintToken?.()
      }}
      isLoadingForTransaction={isLoadingForTransaction}
      onChange={(value) => handleSetMintAmount(value)}
      value={ethers.utils.formatEther(localMintAmount)}
      error={mintTokenError?.message}
      isLoading={isLoading}
      isSuccess={isSuccess}
      type={TextFieldType.Number}
      buttonText='Mint token'
    />
  )
}
