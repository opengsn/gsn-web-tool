import { useAppSelector, useStakeManagerAddress } from '../../../hooks'
import { PingResponse } from '../../../types/PingResponse'

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

  const {
    data: stakeManagerAddressData,
    refetch: refetchStakeManagerAddressData,
    isFetching,
    isLoading
  } = useStakeManagerAddress(relayData.relayHubAddress, chainId)
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

  const StakeMananagerInfoPreparePlaceholder = () => (
    <>
      <TableRow>
        <TableCell>
          <Typography variant={'subtitle2'}>Current Owner</Typography>
        </TableCell>
        <TableCell>
          <Typography variant={'subtitle2'}>loading</Typography>
        </TableCell>
        <TableCell>{''}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Typography variant={'subtitle2'}>staking token</Typography>
        </TableCell>
        <TableCell>
          <Typography variant={'subtitle2'}>loading</Typography>
        </TableCell>
        <TableCell>{''}</TableCell>
      </TableRow>
    </>
  )

  const stakeManagerIsReady = stakeManagerAddress !== undefined && !(isLoading || isFetching)
  return (
    <Table>
      <THead />
      <TableBody>
        <PingResponseData relayData={relayData} showAllInfo={showAllInfo} />
        {stakeManagerIsReady
          ? (
          <StakeInfo stakeManagerAddress={stakeManagerAddress} relayManagerAddress={relayData.relayManagerAddress} />
            )
          : (
          <StakeMananagerInfoPreparePlaceholder />
            )}
      </TableBody>
    </Table>
  )
}

export default RelayInfo
