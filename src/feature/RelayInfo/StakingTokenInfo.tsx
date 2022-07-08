import { useAccount, useBalance } from 'wagmi'

import { Address } from '@opengsn/common/dist/types/Aliases'

interface stakingTokenProps {
  stakingToken: Address
}

export default function StakingTokenInfo ({ stakingToken }: stakingTokenProps) {
  const { address } = useAccount()
  const { data: stakingTokenBalance } = useBalance({
    addressOrName: address,
    token: stakingToken
  })

  return (
    <div>
      StakingTokenInfo: {stakingToken} <b>{stakingTokenBalance?.formatted}</b> <b>{stakingTokenBalance?.symbol}</b>
    </div>
  )
}
