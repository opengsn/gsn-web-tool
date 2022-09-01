import { useContext, useEffect } from 'react'
import { useContract, useContractEvent, useProvider } from 'wagmi'
import { toast } from 'react-toastify'
import { validateIsRelayManagerStaked } from '../registerRelaySlice'

import { TokenContext } from './StakeWithERC20'
import { useAppDispatch, useAppSelector } from '../../../../hooks'

import relayHubAbi from '../../../../contracts/relayHub.json'
import stakeManagerAbi from '../../../../contracts/stakeManager.json'
import { sleep } from '@opengsn/common'

export default function StakeAddedListener () {
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayManagerAddress, relayHubAddress } = relay
  const dispatch = useAppDispatch()
  const provider = useProvider()

  const { stakeManagerAddress, listen } = useContext(TokenContext)

  const relayHub = useContract({
    addressOrName: relayHubAddress,
    contractInterface: relayHubAbi,
    signerOrProvider: provider
  })

  const check = validateIsRelayManagerStaked({ relayManagerAddress, relayHubAddress, provider })

  useEffect(() => {
    if (listen) {
      const askIfRelayIsStaked = async () => {
        const sleepCount = 15
        const sleepMs = 5000
        let i = 0
        while (true) {
          await sleep(sleepMs)
          dispatch(check).catch(toast.error)
          if (sleepCount === i++) {
            throw new Error('Failed to fetch stake')
          }
        }
      }
      askIfRelayIsStaked().catch(toast.error)
    }
  }, [listen, check, dispatch])

  useContractEvent({
    addressOrName: stakeManagerAddress,
    contractInterface: stakeManagerAbi,
    eventName: 'StakeAdded',
    listener () {
      if (listen) return
      toast.info('event caught')
      dispatch(check).catch(toast.error)
    }
  })

  return <span>{listen.toString()}</span>
}
