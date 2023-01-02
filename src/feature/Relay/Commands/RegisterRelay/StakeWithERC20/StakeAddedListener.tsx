import { useContext, useEffect } from 'react'
import { useContractEvent, useProvider } from 'wagmi'
import { toast } from 'react-toastify'
import { validateIsRelayManagerStaked } from '../registerRelaySlice'

import { TokenContext } from './StakeWithERC20'
import { useAppDispatch, useAppSelector } from '../../../../../hooks'

import stakeManagerAbi from '../../../../../contracts/stakeManager.json'
import { sleep } from '../../../../../utils/utils'

export default function StakeAddedListener () {
  const relay = useAppSelector((state) => state.relay.relay)
  const { relayManagerAddress, relayHubAddress } = relay
  const dispatch = useAppDispatch()
  const provider = useProvider()

  const { stakeManagerAddress, listen } = useContext(TokenContext)

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
    address: stakeManagerAddress as any,
    abi: stakeManagerAbi,
    eventName: 'StakeAdded',
    listener () {
      if (listen) return
      dispatch(check).catch(toast.error)
    }
  })

  return <></>
}
