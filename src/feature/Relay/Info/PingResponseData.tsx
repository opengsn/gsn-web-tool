/* eslint-disable multiline-ternary */
import { useAccount, useBalance } from 'wagmi'
import { PingResponse } from '../../../types'
import { formatNumber, isSameAddress, weiToGwei } from '../../../utils'
import { TableCell, TableRow, Typography } from '../../../components/atoms'
import ExplorerLink from '../Commands/RegisterRelay/ExplorerLink'
import { Poppins } from '../../../theme/font'
import { useTheme } from '@mui/material'
import { Chip } from '../../../components/atoms/Chip'

const accordionSummaryInfoArr = ['relayManagerAddress', 'relayWorkerAddress', 'stakingToken', 'ready']

interface IProps {
  relayData: PingResponse
  showAllInfo?: boolean
  explorerLink: string | null
}

function PingResponseData({ relayData, showAllInfo, explorerLink }: IProps) {
  const chainId = Number(relayData.chainId)
  const { address } = useAccount()
  const theme = useTheme()

  const { data: relayManagerBalanceData } = useBalance({
    address: relayData.relayManagerAddress as any,
    watch: true,
    chainId
  })
  const { data: relayWorkerBalanceData } = useBalance({
    address: relayData.relayWorkerAddress as any,
    watch: true,
    chainId
  })

  const camelCaseToHuman = (s: string): string => {
    return s.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
  }

  return (
    <>
      {Object.keys(relayData).map((x, i) => {
        let data
        if (x === 'relayManagerAddress') {
          data = (
            <>
              <TableCell width='33%'>
                <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
                  {camelCaseToHuman(x)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'h6'} fontFamily={Poppins}>
                  {relayData[x as keyof PingResponse]?.toString()}
                </Typography>
                &nbsp;
                {relayData[x as keyof PingResponse]?.toString() && (
                  <ExplorerLink
                    explorerLink={explorerLink}
                    params={`address/${relayData[x as keyof PingResponse]?.toString() as string}`}
                  />
                )}
              </TableCell>
              <TableCell>
                <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
                  Balance: <b>{relayManagerBalanceData?.formatted ? formatNumber(+relayManagerBalanceData?.formatted) : 0} </b>
                  {relayManagerBalanceData?.symbol}
                </Typography>
              </TableCell>
            </>
          )
        } else if (x === 'relayWorkerAddress') {
          data = (
            <>
              <TableCell width='33%'>
                <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
                  {camelCaseToHuman(x)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'h6'} fontFamily={Poppins}>
                  {relayData[x as keyof PingResponse]?.toString()}
                </Typography>
                &nbsp;
                {relayData[x as keyof PingResponse]?.toString() && (
                  <ExplorerLink
                    explorerLink={explorerLink}
                    params={`address/${relayData[x as keyof PingResponse]?.toString() as string}`}
                  />
                )}
              </TableCell>
              <TableCell>
                <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
                  Balance: <b>{relayWorkerBalanceData?.formatted ? formatNumber(+relayWorkerBalanceData?.formatted) : 0} </b>
                </Typography>
              </TableCell>
            </>
          )
        } else if (x === 'ownerAddress' && address !== undefined) {
          const accountIsOwner = isSameAddress(relayData[x], address)
          data = (
            <>
              <TableCell width='33%'>
                <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
                  {camelCaseToHuman(x)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'h6'} fontFamily={Poppins}>
                  {relayData[x as keyof PingResponse]?.toString()}
                </Typography>
                &nbsp;
                {relayData[x as keyof PingResponse]?.toString() && (
                  <ExplorerLink
                    explorerLink={explorerLink}
                    params={`address/${relayData[x as keyof PingResponse]?.toString() as string}`}
                  />
                )}
              </TableCell>
              <TableCell>
                <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
                  {accountIsOwner ? 'currently connected' : 'switch to owner to enable actions'}
                </Typography>
              </TableCell>
            </>
          )
        } else if (x.includes('Gas')) {
          data = (
            <>
              <TableCell width='33%'>
                <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
                  {camelCaseToHuman(x)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'h6'} fontFamily={Poppins}>
                  {relayData?.[x as keyof typeof relayData] && (
                    <b>{formatNumber(weiToGwei(Number(relayData?.[x as keyof typeof relayData])))}</b>
                  )}{' '}
                  Gwei
                </Typography>
              </TableCell>
              <TableCell>{''}</TableCell>
            </>
          )
        } else if (x === 'ready') {
          const isReady = relayData[x as keyof PingResponse] === true
          data = (
            <>
              <TableCell width='33%'>
                <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
                  {camelCaseToHuman(x)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'h6'} fontFamily={Poppins}>
                  {isReady ? (
                    <Chip
                      bgcolor={theme.palette.primary.chipBGSuccess}
                      label={
                        <Typography fontFamily={Poppins} color={theme.palette.primary.mainPos} variant='h6'>
                          Ready
                        </Typography>
                      }
                    />
                  ) : (
                    <Typography variant={'h6'} fontFamily={Poppins}>
                      Not Ready
                    </Typography>
                  )}
                </Typography>
              </TableCell>
              <TableCell>{''}</TableCell>
            </>
          )
        } else {
          data = (
            <>
              <TableCell width='33%'>
                <Typography variant={'h6'} fontFamily={Poppins} color={theme.palette.primary.mainBrightWhite}>
                  {camelCaseToHuman(x)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'h6'} fontFamily={Poppins}>
                  {relayData[x as keyof PingResponse]?.toString()}
                </Typography>
                &nbsp;
                {x.includes('Address') && (
                  <ExplorerLink
                    explorerLink={explorerLink}
                    params={`address/${relayData[x as keyof PingResponse]?.toString() as string}`}
                  />
                )}
              </TableCell>
              <TableCell>{''}</TableCell>
            </>
          )
        }
        return showAllInfo ?? false ? (
          <TableRow key={i}>{data}</TableRow>
        ) : accordionSummaryInfoArr.includes(x) ? (
          <TableRow key={i}>{data}</TableRow>
        ) : null
      })}
    </>
  )
}

export default PingResponseData
