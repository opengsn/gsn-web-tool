import { useProvider } from 'wagmi'
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export interface ManagerBalanceProps {
  address: string | null
  chainId: number
}

function Balance ({ address, chainId }: ManagerBalanceProps) {
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<ethers.BigNumber | null>(null)
  const provider = useProvider({ chainId })

  useEffect(() => {
    if (balance === null) {
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
      fetchBalance(provider).catch(console.error)
    }
  }, [address, provider, balance])

  if (address === null) return <span>n/a</span>
  if (loading) { return <div>loading...</div> }
  if (balance !== null) {
    return <div>
      {ethers.utils.formatEther(balance.toString())}
    </div>
  }
  return <>problem loading balance</>
}

export default React.memo(Balance)
