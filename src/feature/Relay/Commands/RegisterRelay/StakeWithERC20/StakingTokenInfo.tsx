import { useContext } from 'react'
import { useAccount, useBalance } from 'wagmi'

import { TokenContext } from './TokenContextWrapper'

export default function StakingTokenInfo() {
  const { token, chainId } = useContext(TokenContext)

  const { address } = useAccount()
  const { data: tokenBalanceData } = useBalance({
    address: address as any,
    token: token as any,
    chainId
  })

  return (
    <>
      <span>
        <b>{tokenBalanceData?.formatted}</b> {tokenBalanceData?.symbol}
      </span>
    </>
  )
}
