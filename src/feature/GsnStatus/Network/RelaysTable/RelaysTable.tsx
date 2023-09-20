import { ChainWithGsn } from '../../../../types'
import BlockExplorerUrl from '../../components/BlockExplorerUrl'
import { GsnNetworkRelay } from '../../networkListSlice'
import Balance from './Balance'
import RelayLine from './RelayLine'
import RelayUrl from './RelayUrl'
import {
  Box,
  TableHead as MuiTableHead,
  Typography,
  TableBody as MuiTableBody,
  Table,
  TableCell,
  TableContainer,
  TableRow
} from '../../../../components/atoms'
import { Chip } from '../../../../components/atoms/Chip'
import { useTheme } from '@mui/material'
import { addSlashToUrl } from '../../../../utils'

interface RelaysTableProps {
  relays: GsnNetworkRelay[]
  chain: ChainWithGsn
}

export default function RelaysTable({ relays, chain }: RelaysTableProps) {
  const theme = useTheme()
  const blackExplorerUrlWithSlash = addSlashToUrl(chain.blockExplorers?.default.url)

  const TableHead = () => (
    <MuiTableHead>
      <TableRow>
        <TableCell width='40%'>
          <Typography variant='h5' fontWeight={600}>
            URL
          </Typography>
        </TableCell>
        <TableCell width='15%'>
          <Typography variant='h5' fontWeight={600}>
            Status
          </Typography>
        </TableCell>
        <TableCell width='10%'>
          <Typography variant='h5' fontWeight={600}>
            Version
          </Typography>
        </TableCell>
        <TableCell width='20%'>
          <Typography variant='h5' fontWeight={600}>
            Address
          </Typography>
        </TableCell>
        <TableCell width='10%'>
          <Typography variant='h5' fontWeight={600}>
            Balance
          </Typography>
        </TableCell>
        <TableCell width='5%'>{''}</TableCell>
      </TableRow>
    </MuiTableHead>
  )

  const TableBody = () => {
    const sortedRelays = [...relays]
    const content = sortedRelays
      .sort((a, b) => (a.config !== undefined ? -1 : 1))
      .map((x) => {
        if (x.config !== undefined) {
          return <RelayLine key={x.manager} relay={x.config} errorMsg={''} url={x.url} blockExplorer={chain.blockExplorers?.default} />
        } else {
          return (
            <TableRow key={x.manager}>
              <TableCell>
                <RelayUrl url={x.url} />
              </TableCell>
              <TableCell>
                <Chip
                  label={
                    <Typography color={theme.palette.primary.chipTextError} variant='h5'>
                      {x.errorMsg}
                    </Typography>
                  }
                  bgcolor={theme.palette.primary.chipBGError}
                />
              </TableCell>
              <TableCell>{''}</TableCell>
              <TableCell>
                <Box display='flex' width='160px'>
                  <Box mr='auto'>
                    <Typography variant='h6'>Manager</Typography>
                  </Box>
                  <BlockExplorerUrl address={x.manager} url={`${blackExplorerUrlWithSlash}/address/${x.manager}`} />
                  <br />
                  <br />
                </Box>
              </TableCell>
              <TableCell>
                <Balance address={x.manager} chainId={chain.id} />
                <br />
                <br />
              </TableCell>
              <TableCell>{''}</TableCell>
            </TableRow>
          )
        }
      })

    return <MuiTableBody>{content}</MuiTableBody>
  }

  return (
    <Box mt={4}>
      <TableContainer>
        <Table>
          <TableHead />
          <TableBody />
        </Table>
      </TableContainer>
    </Box>
  )
}
