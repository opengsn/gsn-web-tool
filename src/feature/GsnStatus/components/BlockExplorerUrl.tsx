import { Box, Link, Typography } from '../../../components/atoms'
import { useTheme } from '@mui/material'
import CopyButton from '../../../components/molecules/CopyButton'

interface IProps {
  address: string
  url?: string
  truncate?: boolean
}

export default function BlockExplorerUrl({ address, url, truncate = true }: IProps) {
  const theme = useTheme()

  const firstFourCharsInAddr = address.slice(0, 4)
  const lastFourCharsInAddr = address.slice(-4)
  const truncated = `${firstFourCharsInAddr}...${lastFourCharsInAddr}`

  let addressElem
  if (url !== undefined) {
    addressElem = (
      <Link href={url} textDecorationColor={theme.palette.primary.mainCTA}>
        <Typography variant='h6' color={theme.palette.primary.mainCTA}>
          {truncate ? truncated : address}
        </Typography>
      </Link>
    )
  } else {
    addressElem = (
      <Typography variant='h6' color={theme.palette.primary.mainCTA}>
        {truncate ? truncated : address}
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
