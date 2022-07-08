import { PingResponse } from '@opengsn/common'
import { useBalance, useContractRead } from 'wagmi'

import relayHubAbi from '../../contracts/relayHub.json'
import { useAppSelector } from '../../hooks'
import StakeInfo from './StakeInfo'

function Info () {
  const relay = useAppSelector((state) => state.relay)
  const relayUrl: string = relay.relayUrl
  const relayData: PingResponse = relay.relay

  const { data: relayManagerBalanceData } = useBalance({ addressOrName: relayData.relayManagerAddress })
  const { data: relayWorkerBalanceData } = useBalance({ addressOrName: relayData.relayWorkerAddress })

  const { data: stakeManagerAddressData, isLoading } = useContractRead({
    addressOrName: relayData.relayHubAddress,
    contractInterface: relayHubAbi,
    functionName: 'getStakeManager',
    watch: false,
    onError (err) { console.warn(err) }
  })

  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  return (
    <div>
      <span>{relayData.ownerAddress}</span>{' '}
      <span>{relayUrl}</span>

      <h5>Getaddr info:</h5>
      {
        Object.keys(relayData).map((x, i) => {
          if (x === 'relayManagerAddress') {
            return (
              <div key={i}>
                {x}: {(relayData[x as keyof PingResponse])?.toString()}
                {' '}
                <b>{relayManagerBalanceData?.formatted} {relayManagerBalanceData?.symbol}</b>
              </div>
            )
          } else if (x === 'relayWorkerAddress') {
            return (
              <div key={i}>
                {x}: {(relayData[x as keyof PingResponse])?.toString()}
                {' '}
                <b>{relayWorkerBalanceData?.formatted} {relayWorkerBalanceData?.symbol}</b>
              </div>
            )
          } else {
            return <div key={i}>{x}: {(relayData[x as keyof PingResponse])?.toString()}</div>
          }
        })
      }
      <h5>Stake info:</h5>
      { isLoading && stakeManagerAddress !== undefined
        ? <span>Loading</span>
        : <StakeInfo stakeManagerAddress={stakeManagerAddress} relayManagerAddress={relayData.relayManagerAddress} />
      }
    </div>
  )
}
export default Info
