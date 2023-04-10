import { ethers } from 'ethers'
import { useAccount, useBalance } from 'wagmi'
import { PingResponse } from '../../../types'
import { isSameAddress } from '../../../utils'
import { TableCell, TableRow, Typography, VariantType } from '../../../components/atoms'

function PingResponseData({ relayData }: { relayData: PingResponse }) {
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
              <TableCell>
                <Typography variant={VariantType.H6}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={VariantType.H6}>{relayData[x as keyof PingResponse]?.toString()}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={VariantType.H6}>
                  <span>
                    Balance: <b>{relayManagerBalanceData?.formatted}</b>
                  </span>{' '}
                  <span>{relayManagerBalanceData?.symbol}</span>
                </Typography>
              </TableCell>
            </>
          )
        } else if (x === 'relayWorkerAddress') {
          data = (
            <>
              <TableCell>
                <Typography variant={VariantType.H6}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={VariantType.H6}>{relayData[x as keyof PingResponse]?.toString()}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={VariantType.H6}>
                  <span>
                    Balance: <b>{relayWorkerBalanceData?.formatted}</b>
                  </span>{' '}
                  <span>{relayWorkerBalanceData?.symbol}</span>
                </Typography>
              </TableCell>
            </>
          )
        } else if (x === 'ownerAddress' && address !== undefined) {
          const accountIsOwner = isSameAddress(relayData[x], address)
          data = (
            <>
              <TableCell>
                <Typography variant={VariantType.H6}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={VariantType.H6}>{relayData[x as keyof PingResponse]?.toString()}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={VariantType.H6}>
                  <b>{accountIsOwner ? 'currently connected' : 'switch to owner to enable actions'}</b>
                </Typography>
              </TableCell>
            </>
          )
        } else if (x === 'minMaxPriorityFeePerGas') {
          data = (
            <>
              <TableCell>
                <Typography variant={VariantType.H6}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={VariantType.H6}>{ethers.utils.formatEther(relayData.minMaxPriorityFeePerGas)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={VariantType.H6}>
                  <b>Native currency, value in ethers</b>
                </Typography>
              </TableCell>
            </>
          )
        } else if (x === 'ready') {
          data = (
            <>
              <TableCell>
                <Typography variant={VariantType.H6}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>{relayData[x as keyof PingResponse] === true ? <span>ready</span> : <span>not ready</span>}</TableCell>
              <TableCell>{''}</TableCell>
            </>
          )
        } else {
          data = (
            <>
              <TableCell>
                <Typography variant={VariantType.H6}>{camelCaseToHuman(x)}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant={VariantType.H6}>{relayData[x as keyof PingResponse]?.toString()}</Typography>
              </TableCell>
              <TableCell>{''}</TableCell>
            </>
          )
        }
        return <TableRow key={i}>{data}</TableRow>
      })}
    </>
  )
}

export default PingResponseData
