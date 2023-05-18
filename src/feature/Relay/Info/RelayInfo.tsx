import { useAppSelector, useStakeManagerAddress } from '../../../hooks'
import { PingResponse } from '../../../types/PingResponse'
import gsnNetworks from '../../blockchain/gsn-networks.json'

import StakeInfo from './StakeInfo'
import PingResponseData from './PingResponseData'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '../../../components/atoms'
import { useEffect } from 'react'

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
  }, [])

  const THead = () => (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography fontWeight={600} variant={'subtitle2'}>
            Name
          </Typography>
        </TableCell>
        <TableCell>
          <Typography fontWeight={600} variant={'subtitle2'}>
            Value
          </Typography>
        </TableCell>
        <TableCell>
          <Typography fontWeight={600} variant={'subtitle2'}>
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
