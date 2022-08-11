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
        <span>Balance <b>{stakingTokenBalance?.formatted}<b> {stakingTokenBalance?.symbol}</b></span>
      </td>
    </tr>
  )
}
