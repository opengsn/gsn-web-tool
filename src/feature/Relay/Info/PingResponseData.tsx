import { ethers } from 'ethers'
import { useAccount, useBalance } from 'wagmi'
import { PingResponse } from '../../../types'
import { isSameAddress } from '../../../utils'
import { TableCell, TableRow, Typography } from '../../../components/atoms'
import ExplorerLink from '../Commands/RegisterRelay/ExplorerLink'

const accordionSummaryInfoArr = ['relayManagerAddress', 'relayWorkerAddress', 'stakingToken', 'ready']

interface IProps {
  relayData: PingResponse
  showAllInfo?: boolean
  explorerLink: string | null
}

function PingResponseData({ relayData, showAllInfo, explorerLink }: IProps) {
  const chainId = Number(relayData.chainId)
  const { address } = useAccount()

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
                <Typography variant={'subtitle2'}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'subtitle2'}>{relayData[x as keyof PingResponse]?.toString()}</Typography>
                &nbsp;
                {relayData[x as keyof PingResponse]?.toString() && (
                  <ExplorerLink
                    explorerLink={explorerLink}
                    params={`address/${relayData[x as keyof PingResponse]?.toString() as string}`}
                  />
                )}
              </TableCell>
              <TableCell>
                <Typography variant={'subtitle2'}>
                  Balance: <b>{relayManagerBalanceData?.formatted} </b>
                  {relayManagerBalanceData?.symbol}
                </Typography>
              </TableCell>
            </>
          )
        } else if (x === 'relayWorkerAddress') {
          data = (
            <>
              <TableCell width='33%'>
                <Typography variant={'subtitle2'}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'subtitle2'}>{relayData[x as keyof PingResponse]?.toString()}</Typography>
                &nbsp;
                {relayData[x as keyof PingResponse]?.toString() && (
                  <ExplorerLink
                    explorerLink={explorerLink}
                    params={`address/${relayData[x as keyof PingResponse]?.toString() as string}`}
                  />
                )}
              </TableCell>
              <TableCell>
                <Typography variant={'subtitle2'}>
                  Balance: <b>{relayWorkerBalanceData?.formatted}</b> {relayWorkerBalanceData?.symbol}
                </Typography>
              </TableCell>
            </>
          )
        } else if (x === 'ownerAddress' && address !== undefined) {
          const accountIsOwner = isSameAddress(relayData[x], address)
          data = (
            <>
              <TableCell width='33%'>
                <Typography variant={'subtitle2'}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'subtitle2'}>{relayData[x as keyof PingResponse]?.toString()}</Typography>
                &nbsp;
                {relayData[x as keyof PingResponse]?.toString() && (
                  <ExplorerLink
                    explorerLink={explorerLink}
                    params={`address/${relayData[x as keyof PingResponse]?.toString() as string}`}
                  />
                )}
              </TableCell>
              <TableCell>
                <Typography variant={'subtitle2'}>
                  <b>{accountIsOwner ? 'currently connected' : 'switch to owner to enable actions'}</b>
                </Typography>
              </TableCell>
            </>
          )
        } else if (x === 'minMaxPriorityFeePerGas') {
          data = (
            <>
              <TableCell width='33%'>
                <Typography variant={'subtitle2'}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'subtitle2'}>{relayData.minMaxPriorityFeePerGas}</Typography>
              </TableCell>
              <TableCell>{''}</TableCell>
            </>
          )
        } else if (x === 'ready') {
          data = (
            <>
              <TableCell width='33%'>
                <Typography variant={'subtitle2'}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'subtitle2'}>
                  {relayData[x as keyof PingResponse] === true
                    ? (
                    <Typography variant='subtitle2' color='success.main'>
                      Ready
                    </Typography>
                      )
                    : (
                    <Typography variant='subtitle2'>Not ready</Typography>
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
                <Typography variant={'subtitle2'}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={'subtitle2'}>{relayData[x as keyof PingResponse]?.toString()}</Typography>
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
        return showAllInfo ?? false
          ? (
          <TableRow key={i}>{data}</TableRow>
            )
          : accordionSummaryInfoArr.includes(x)
            ? (
          <TableRow key={i}>{data}</TableRow>
              )
            : null
      })}
    </>
  )
}

export default PingResponseData
