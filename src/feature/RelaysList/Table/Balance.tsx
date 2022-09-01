import { useBalance, useProvider } from 'wagmi'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { toNumber } from '@opengsn/common'

export interface ManagerBalanceProps {
  address: string | null
  chainId: number
}

function Balance ({ address, chainId }: ManagerBalanceProps) {
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<ethers.BigNumber | null>(null)
  const provider = useProvider({ chainId: chainId })

  const fetchBalance = async (provider: ethers.providers.BaseProvider) => {
    if (address === null) return
    try {
      setLoading(true)
      const workerBalance = await provider.getBalance(address)
      setBalance(workerBalance)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (balance === null) {
      fetchBalance(provider).catch(console.error)
    }
  }, [address, provider])

  if (address === null) return <span>n/a</span>
  if (loading) { return <>loading...</> }
  if (balance !== null) {
    return <span>
      {ethers.utils.formatEther(balance.toString())}
    </span>
  }
  return <>problem loading balance</>
}

export default React.memo(Balance)
