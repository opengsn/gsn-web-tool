import React from 'react'
import { ethers } from 'ethers'
import { useAccount, useBalance } from 'wagmi'
import { useAppSelector } from '../../../hooks'
import { PingResponse } from '../../../types'
import { isSameAddress } from '../../../utils'

function PingResponseData ({ relayData }: { relayData: PingResponse }) {
  // const relayData: PingResponse = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relayData.chainId)
  const { address } = useAccount()

  const { data: relayManagerBalanceData } = useBalance({
    addressOrName: relayData.relayManagerAddress,
    watch: true,
    chainId
  })
  const { data: relayWorkerBalanceData } = useBalance({
    addressOrName: relayData.relayWorkerAddress,
    watch: true,
    chainId
  })

  const camelCaseToHuman = (s: string): string => {
    return s.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  return (<>
    {Object.keys(relayData).map((x, i) => {
      let data
      if (x === 'relayManagerAddress') {
        data = (
          <>
            <td>
              {camelCaseToHuman(x)}
            </td>
            <td>{(relayData[x as keyof PingResponse])?.toString()}</td>
            <td>
              <span>Balance: <b>{relayManagerBalanceData?.formatted}</b></span>{' '}
              <span>{relayManagerBalanceData?.symbol}</span>
            </td>
          </>
        )
      } else if (x === 'relayWorkerAddress') {
        data = (
          <>
            <td>{camelCaseToHuman(x)}</td>
            <td>{(relayData[x as keyof PingResponse])?.toString()}</td>
            <td>
              <span>Balance: <b>{relayWorkerBalanceData?.formatted}</b></span>{' '}
              <span>{relayWorkerBalanceData?.symbol}</span>
            </td>
          </>
        )
      } else if (x === 'ownerAddress' && address !== undefined) {
        const accountIsOwner = isSameAddress(relayData[x], address)
        data = (
          <>
            <td>{camelCaseToHuman(x)}</td>
            <td>
              {(relayData[x as keyof PingResponse])?.toString()}
            </td>
            <td>
              <b>{accountIsOwner
                ? 'currently connected'
                : 'switch to owner to enable actions'}</b>
            </td>
          </>
        )
      } else if (x === 'minMaxPriorityFeePerGas') {
        data = (
          <>
            <td>{camelCaseToHuman(x)}</td>
            <td>{ethers.utils.formatEther(relayData.minMaxPriorityFeePerGas)}</td>
            <td><b>Native currency, value in ethers</b></td>
          </>
        )
      } else if (x === 'ready') {
        data = (
          <>
            <td>{camelCaseToHuman(x)}</td>
            <td>{relayData[x as keyof PingResponse] === true
              ? <span>ready</span>
              : <span>not ready</span>}
            </td>
            <td></td>
          </>
        )
      } else {
        data = (
          <>
            <td>{camelCaseToHuman(x)}</td>
            <td>{(relayData[x as keyof PingResponse])?.toString()}</td>
            <td></td>
          </>
        )
      }
      return <tr key={i}>{data}</tr>
    })}
  </>)
}

export default PingResponseData
