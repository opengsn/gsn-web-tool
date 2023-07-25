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

interface RelaysTableProps {
  relays: GsnNetworkRelay[]
  chain: ChainWithGsn
}

export default function RelaysTable({ relays, chain }: RelaysTableProps) {
  const theme = useTheme()
  const TableHead = () => (
    <MuiTableHead>
      <TableRow>
        <TableCell width='40%'>
          <Typography variant='h4' fontWeight={600}>
            URL
          </Typography>
        </TableCell>
        <TableCell width='15%'>
          <Typography variant='h4' fontWeight={600}>
            Status
          </Typography>
        </TableCell>
        <TableCell width='15%'>
          <Typography variant='h4' fontWeight={600}>
            Version
          </Typography>
        </TableCell>
        <TableCell width='15%'>
          <Typography variant='h4' fontWeight={600}>
            Address
          </Typography>
        </TableCell>
        <TableCell width='10%'>
          <Typography variant='h4' fontWeight={600}>
            Balance
          </Typography>
        </TableCell>
        <TableCell width='5%'>{''}</TableCell>
      </TableRow>
    </MuiTableHead>
  )

  const TableBody = () => {
    const content = relays.map((x) => {
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
                  <Typography color={theme.palette.primary.chipTextError} variant='h4'>
                    {x.errorMsg}
                  </Typography>
                }
                bgcolor={theme.palette.primary.chipBGError}
              />
            </TableCell>
            <TableCell>{''}</TableCell>
            <TableCell>
              <BlockExplorerUrl address={x.manager} url={chain.blockExplorers?.default.url} />
            </TableCell>
            <TableCell>
              <Balance address={x.manager} chainId={chain.id} />
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
