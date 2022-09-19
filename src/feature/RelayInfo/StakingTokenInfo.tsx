import { useAccount, useBalance } from 'wagmi'

interface stakingTokenProps {
  stakingToken: string
  chainId: number
}

export default function StakingTokenInfo ({ stakingToken, chainId }: stakingTokenProps) {
  const { address } = useAccount()
  const { data: stakingTokenBalance } = useBalance({
    addressOrName: address,
    token: stakingToken,
    chainId
  })

  const BalanceData = () => {
    if (address !== undefined) {
      return <span>Balance <b>{stakingTokenBalance?.formatted}</b> {stakingTokenBalance?.symbol}</span>
    } else {
      return <></>
    }
  }

  return (
    <tr>
      <td>Staking Token</td>
      <td>{stakingToken}</td>
      <td>
        <BalanceData />
      </td>
    </tr>
  )
}
