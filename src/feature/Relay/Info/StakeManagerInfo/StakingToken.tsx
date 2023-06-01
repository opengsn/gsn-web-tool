import { useAccount, useBalance } from 'wagmi'
import { TableCell, TableRow, Typography } from '../../../../components/atoms'
import ExplorerLink from '../../Commands/RegisterRelay/ExplorerLink'

interface stakingTokenProps {
  stakingToken: string
  chainId: number
  explorerLink: string | null
}

export default function StakingToken({ stakingToken, chainId, explorerLink }: stakingTokenProps) {
  const { address } = useAccount()
  const { data: stakingTokenBalance } = useBalance({
    address: address as any,
    token: stakingToken as any,
    chainId
  })

  const BalanceData = () => {
    if (address !== undefined) {
      return (
        <Typography variant='subtitle2'>
          Balance: <b>{stakingTokenBalance?.formatted ?? '0.0'}</b> {stakingTokenBalance?.symbol}
        </Typography>
      )
    } else {
      return (
        <Typography variant='subtitle2'>
          Balance: <b>0.0</b>
        </Typography>
      )
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Typography variant={'subtitle2'}>Staking Token</Typography>
      </TableCell>
      <TableCell>
        <Typography variant={'subtitle2'}>{stakingToken || 'Loading..'}</Typography>
        &nbsp;
        {stakingToken && <ExplorerLink explorerLink={explorerLink} params={`address/${stakingToken}`} />}
      </TableCell>
      <TableCell>
        <Typography variant={'subtitle2'}>
          <BalanceData />
        </Typography>
      </TableCell>
    </TableRow>
  )
}
