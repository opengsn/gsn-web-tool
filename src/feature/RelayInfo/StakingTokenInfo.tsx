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
    <tr>
      <td>Staking Token</td>
      <td>{stakingToken}</td>
      <td>
        <span>{stakingTokenBalance?.formatted}</span> <b>{stakingTokenBalance?.symbol}</b>
      </td>
    </tr>
  )
}
