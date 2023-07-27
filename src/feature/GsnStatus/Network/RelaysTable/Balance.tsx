import { useBalance } from 'wagmi'
import { formatNumber } from '../../../../utils'
import { Typography } from '../../../../components/atoms'
import { useTheme } from '@mui/material'

export interface ManagerBalanceProps {
  address: string
  chainId: number
}

function Balance({ address, chainId }: ManagerBalanceProps) {
  const theme = useTheme()
  const {
    data: balanceData,
    isError,
    isSuccess,
    isLoading
  } = useBalance({
    address: address as any,
    watch: false,
    chainId
  })

  let content
  switch (true) {
    case isError:
      content = 'problem fetching balance data'
      break
    case isLoading:
      content = 'Loading...'
      break
    case isSuccess:
      content = formatNumber(+(balanceData?.formatted ?? 0))
      break
    default:
      content = 'error fetching balance'
  }

  return (
    <Typography variant='h6' color={theme.palette.primary.mainBrightWhite}>
      {content}
    </Typography>
  )
}

export default Balance
