import { useAccount, useBalance } from 'wagmi'

interface stakingTokenProps {
  stakingToken: string
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
        <span>Balance <b>{stakingTokenBalance?.formatted}</b> {stakingTokenBalance?.symbol}</span>
      </td>
    </tr>
  )
}
