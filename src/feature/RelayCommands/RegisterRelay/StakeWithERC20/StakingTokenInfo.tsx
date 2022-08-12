import { useContext } from 'react'
import { useAccount, useBalance, useContractWrite, useToken } from 'wagmi'
import { TokenContext } from './StakeWithERC20'

export default function StakingTokenInfo () {
  const { token, minimumStakeForToken, stakeManagerAddress, setListen } = useContext(TokenContext)

  const { address } = useAccount()
  const { data: tokenBalanceData } = useBalance({ addressOrName: address, token: token })

  return <><span><b>{tokenBalanceData?.formatted}</b> {tokenBalanceData?.symbol}</span></>
}
