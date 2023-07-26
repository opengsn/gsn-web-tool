import { Box, Link, Typography } from '../../../components/atoms'
import { useTheme } from '@mui/material'
import CopyButton from '../../../components/molecules/CopyButton'

interface IProps {
  address: string
  url?: string
}

export default function BlockExplorerUrl({ address, url }: IProps) {
  const theme = useTheme()

  const firstFourCharsInAddr = address.slice(2, 6)
  const lastFourCharsInAddr = address.slice(-4)
  const truncated = `${firstFourCharsInAddr}...${lastFourCharsInAddr}`

  let addressElem
  if (url !== undefined) {
    addressElem = (
      <Link href={`${url}/address/${address}`} textDecorationColor={theme.palette.primary.mainCTA}>
        <Typography variant='h5' color={theme.palette.primary.mainCTA}>
          {truncated}
        </Typography>
      </Link>
    )
  } else {
    addressElem = (
      <Typography variant='h5' color={theme.palette.primary.mainCTA}>
        {truncated}
      </Typography>
    )
  }

  return (
    <>
      {addressElem}
      &nbsp;
      <Box component='span'>
        <CopyButton copyValue={address} />
      </Box>
    </>
  )
}
