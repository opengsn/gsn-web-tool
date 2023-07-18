import { constants, ethers } from 'ethers'
import * as React from 'react'
import { useToken } from 'wagmi'
import { IFoundToken } from './RelayHubInfo'

interface TokenValueInfoProps extends IFoundToken {
  chainId: number
}

export function TokenValueInfo ({ token, minimumStake, chainId }: TokenValueInfoProps) {
  const { data: tokenData } = useToken({
    address: token as any,
    enabled: token !== constants.AddressZero,
    chainId
  })
  return (
    <span>
      {ethers.utils.formatEther(minimumStake)} {tokenData?.symbol}
    </span>
  )
}
