import { useAccount, useBalance } from 'wagmi'
import { TableCell, TableRow, Typography } from '../../../../components/atoms'
import ExplorerLink from '../../Commands/RegisterRelay/ExplorerLink'
import { constants } from 'ethers'
import { Poppins } from '../../../../theme/font'
import { useTheme } from '@mui/material'

interface stakingTokenProps {
  stakingToken: string
  chainId: number
  explorerLink: string | null
}

export default function StakingToken({ stakingToken, chainId, explorerLink }: stakingTokenProps) {
  const { address } = useAccount()
  const { data: stakingTokenBalance } = useBalance({
    address: address as any,
    enabled: stakingToken !== constants.AddressZero,
    token: stakingToken as any,
    chainId
  })
  const theme = useTheme()

  const BalanceData = () => {
    if (address !== undefined) {
      return (
        <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
          Balance: <b>{stakingTokenBalance?.formatted ?? '0.0'}</b> {stakingTokenBalance?.symbol}
        </Typography>
      )
    } else {
      return (
        <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
          Balance: <b>0.0</b>
        </Typography>
      )
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
          Staking Token
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant={'h6'} fontFamily={Poppins}>
          {stakingToken || 'Loading..'}
        </Typography>
        &nbsp;
        {stakingToken && <ExplorerLink explorerLink={explorerLink} params={`address/${stakingToken}`} />}
      </TableCell>
      <TableCell>
        <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
          <BalanceData />
        </Typography>
      </TableCell>
    </TableRow>
  )
}
