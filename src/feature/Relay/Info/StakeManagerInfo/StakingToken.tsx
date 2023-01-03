import { useAccount, useBalance } from 'wagmi'

interface stakingTokenProps {
  stakingToken: string
  chainId: number
}

export default function StakingToken ({ stakingToken, chainId }: stakingTokenProps) {
  const { address } = useAccount()
  const { data: stakingTokenBalance } = useBalance({
    address: address as any,
    token: stakingToken as any,
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
