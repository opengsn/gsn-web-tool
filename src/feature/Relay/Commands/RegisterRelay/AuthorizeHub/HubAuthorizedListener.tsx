import { useEffect } from 'react'
import { useAccount, useContractEvent, useProvider } from 'wagmi'
import { toast } from 'react-toastify'
import { fetchRegisterStateData, jumpToStep } from '../registerRelaySlice'

import { sleep } from '../../../../../utils'

import { useAppDispatch, useAppSelector, useStakeManagerAddress } from '../../../../../hooks'

import StakeManager from '../../../../../contracts/StakeManager.json'
import { fetchRelayData } from '../../../../Relay/relaySlice'
import { RegisterSteps } from '../RegisterFlowSteps'

interface HubAuthorizedListenerProps {
  listen: boolean
  setListen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HubAuthorizedListener({ listen, setListen }: HubAuthorizedListenerProps) {
  // used to avoid listening for event and polling data at the same time
  const relay = useAppSelector((state) => state.relay.relay)
  const relayUrl = useAppSelector((state) => state.relay.relayUrl)
  const { relayHubAddress } = relay
  const chainId = Number(relay.chainId)

  const dispatch = useAppDispatch()
  const provider = useProvider()
  const { address: account } = useAccount()

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)

  const stakeManagerAddress = stakeManagerAddressData as any

  useContractEvent({
    address: stakeManagerAddress,
    abi: StakeManager.abi,
    eventName: 'HubAuthorized',
    listener: () => {
      if (listen) return
      dispatch(fetchRelayData(relayUrl)).catch(console.error)
    }
  })

  useEffect(() => {
    const waitForRelay = async (relayUrl: string, timeout = 60): Promise<void> => {
      console.error(`Will wait up to ${timeout}s for the relay to be ready`)

      const endTime = Date.now() + timeout * 10000
      while (Date.now() < endTime) {
        dispatch(fetchRelayData(relayUrl)).catch(toast.error)
        await sleep(3000)
      }
      setListen(false)
      throw Error(`Relay not ready after ${timeout}s`)
    }

    if (listen) {
      waitForRelay(relayUrl).catch(toast.error)
    }
  }, [listen, relayUrl, dispatch, setListen])

  useEffect(() => {
    if (relay.ready && account !== undefined) {
      dispatch(fetchRegisterStateData({ provider, account })).catch(() => jumpToStep(RegisterSteps.Error as number))
    } else if (relay.ready) {
      console.error('relay is ready but could not fetch account address')
    }
  }, [relay, account, provider, dispatch])

  return <></>
}
