import { useAccount, useBalance } from 'wagmi'
import { TableCell, TableRow, Typography, VariantType } from '../../../../components/atoms'

interface stakingTokenProps {
  stakingToken: string
  chainId: number
}

export default function StakingToken({ stakingToken, chainId }: stakingTokenProps) {
  const { address } = useAccount()
  const { data: stakingTokenBalance } = useBalance({
    address: address as any,
    token: stakingToken as any,
    chainId
  })

  const BalanceData = () => {
    if (address !== undefined) {
      return (
        <span>
          Balance <b>{stakingTokenBalance?.formatted}</b> {stakingTokenBalance?.symbol}
        </span>
      )
    } else {
      return <></>
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Typography variant={VariantType.H6}>Staking Token</Typography>
      </TableCell>
      <TableCell>
        <Typography variant={VariantType.H6}>{stakingToken}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant={VariantType.H6}>
          <BalanceData />
        </Typography>
      </TableCell>
    </TableRow>
  )
}
