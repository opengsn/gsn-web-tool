import { useAppSelector, useStakeManagerAddress } from '../../../hooks'
import { PingResponse } from '../../../types/PingResponse'
import gsnNetworks from '../../blockchain/gsn-networks.json'

import StakeInfo from './StakeInfo'
import PingResponseData from './PingResponseData'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '../../../components/atoms'
import { useEffect } from 'react'
import { Poppins } from '../../../theme/font'

interface IProps {
  showAllInfo?: boolean
}

function RelayInfo({ showAllInfo }: IProps) {
  const relayData: PingResponse = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relayData.chainId)
  const explorerLink = chainId ? (gsnNetworks as any)?.[chainId]?.[0].explorer : null

  const { data: stakeManagerAddressData, refetch: refetchStakeManagerAddressData } = useStakeManagerAddress(
    relayData.relayHubAddress,
    chainId
  )
  const stakeManagerAddress = stakeManagerAddressData as any

  useEffect(() => {
    refetchStakeManagerAddressData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const THead = () => (
    <TableHead>
      <TableRow>
        <TableCell width='35%'>
          <Typography fontWeight={500} variant={'h4'} fontFamily={Poppins} opacity={0.8}>
            Name
          </Typography>
        </TableCell>
        <TableCell width='45%'>
          <Typography fontWeight={500} variant={'h4'} fontFamily={Poppins} opacity={0.8}>
            Value
          </Typography>
        </TableCell>
        <TableCell width='20%'>
          <Typography fontWeight={500} variant={'h4'} fontFamily={Poppins} opacity={0.8}>
            Extra
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  )

  return (
    <Table>
      <THead />
      <TableBody>
        <PingResponseData relayData={relayData} showAllInfo={showAllInfo} explorerLink={explorerLink} />
        <StakeInfo
          stakeManagerAddress={stakeManagerAddress}
          relayManagerAddress={relayData.relayManagerAddress}
          explorerLink={explorerLink}
        />
      </TableBody>
    </Table>
  )
}

export default RelayInfo
