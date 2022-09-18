import { useBalance, useProvider } from 'wagmi'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export interface ManagerBalanceProps {
  address: string
  chainId: number
}

function Balance ({ address, chainId }: ManagerBalanceProps) {
  const { data: balanceData, isError, isSuccess, isLoading } = useBalance({
    addressOrName: address,
    watch: false,
    chainId
  })

  let content
  switch (true) {
    case isError:
      content = <span>problem fetching balance data </span>
      break
    case isLoading:
      content = <span>Loading...</span>
      break
    case isSuccess:
      content = <span>{balanceData?.formatted}</span>
      break
    default:
      content = <span>error fetching balance</span>
  }

  return <div>{content}</div>
}

export default Balance
