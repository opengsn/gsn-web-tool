import { isSameAddress, PingResponse } from '@opengsn/common'
import { useAccount, useBalance, useContractRead } from 'wagmi'

import relayHubAbi from '../../contracts/relayHub.json'
import { useAppSelector } from '../../hooks'
import StakeInfo from './StakeInfo'

function Info () {
  const relay = useAppSelector((state) => state.relay)
  const relayUrl: string = relay.relayUrl
  const relayData: PingResponse = relay.relay

  const { address } = useAccount()

  const { data: relayManagerBalanceData } = useBalance({ addressOrName: relayData.relayManagerAddress })
  const { data: relayWorkerBalanceData } = useBalance({ addressOrName: relayData.relayWorkerAddress })

  const { data: stakeManagerAddressData, isLoading, isFetching } = useContractRead({
    addressOrName: relayData.relayHubAddress,
    contractInterface: relayHubAbi,
    functionName: 'getStakeManager',
    watch: false,
    onError (err) { console.warn(err) }
  })

  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  const RelayURLDisplay = () => { return <span>{relayUrl}</span> }

  const PingResponseData = () => {
    return (
      <div>
        {Object.keys(relayData).map((x, i) => {
          let dataDiv
          if (x === 'relayManagerAddress') {
            dataDiv = (
              <div key={i}>
                {x}: {(relayData[x as keyof PingResponse])?.toString()}
                {' '}
                <b>{relayManagerBalanceData?.formatted} {relayManagerBalanceData?.symbol}</b>
              </div>
            )
          } else if (x === 'relayWorkerAddress') {
            dataDiv = (
              <div key={i}>
                {x}: {(relayData[x as keyof PingResponse])?.toString()}
                {' '}
                <b>{relayWorkerBalanceData?.formatted} {relayWorkerBalanceData?.symbol}</b>
              </div>
            )
          } else if (x === 'ownerAddress' && address !== undefined) {
            const accountIsOwner = isSameAddress(relayData[x], address)
            dataDiv = <div key={i}>
              {x}: {(relayData[x as keyof PingResponse])?.toString()}
              {' '}
              <b>{ accountIsOwner ? '(connected account)'
                : '(switch to the owner account to unlock register/deregister)' }</b>
            </div>
          } else {
            dataDiv = <div key={i}>{x}: {(relayData[x as keyof PingResponse])?.toString()}</div>
          }

          return dataDiv
        })}
      </div>
    )
  }

  return (
    <div>
      <RelayURLDisplay />
      <h5>Getaddr info:</h5>
      <PingResponseData />
      <h5>Stake info:</h5>
      { (isFetching || isLoading) && stakeManagerAddress !== undefined
        ? <div>current owner: loading <br /> staking token: loading</div>
        : <StakeInfo stakeManagerAddress={stakeManagerAddress} relayManagerAddress={relayData.relayManagerAddress} />
      }
    </div>
  )
}
export default Info
