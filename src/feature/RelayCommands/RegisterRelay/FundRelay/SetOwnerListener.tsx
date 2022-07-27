import { useContext, useEffect } from 'react'
import { useAccount, useContractEvent, useContractRead, useProvider } from 'wagmi'

import { fetchRegisterStateData } from '../registerRelaySlice'

import { useAppDispatch } from '../../../../hooks'
import { FunderContext } from './Funder'

import stakeManagerAbi from '../../../../contracts/stakeManager.json'
import { isSameAddress, constants, sleep } from '@opengsn/common'
import { toast } from 'react-toastify'

export default function SetOwnerListener () {
  const dispatch = useAppDispatch()
  const provider = useProvider()
  const { address: account } = useAccount()
  const funderData = useContext(FunderContext)

  const {
    listen,
    setListen,
    stakeManagerAddress,
    relayManagerAddress
  } = funderData

  useContractEvent({
    addressOrName: stakeManagerAddress,
    contractInterface: stakeManagerAbi,
    eventName: 'OwnerSet',
    listener: () => {
      if (!listen && account !== undefined) {
        toast.info('event caught')
        dispatch(fetchRegisterStateData({ provider, account })).
          catch(console.error)
      }
    }
  })

  const { data: stakeInfo, refetch } = useContractRead({
    addressOrName: stakeManagerAddress,
    contractInterface: stakeManagerAbi,
    args: relayManagerAddress,
    functionName: 'getStakeInfo',
    watch: false
  })

  useEffect(() => {
    if (listen && account !== undefined && stakeInfo !== undefined) {
      const { owner } = stakeInfo[0]

      const askIfOwnerIsSet = async () => {
        const sleepCount = 15
        const sleepMs = 5000
        if (owner === constants.ZERO_ADDRESS) {
          let i = 0
          while (true) {
            console.debug(`Waiting ${sleepMs}ms ${i}/${sleepCount} for relayer to set (us) as owner`)
            await sleep(sleepMs)
            const newStakeInfo = (await refetch())
            if (newStakeInfo.data === undefined) {
              throw new Error('Failed to refetch StakeManager data')
            }
            const newOwner = newStakeInfo.data[0].owner
            if (
              newOwner !== constants.ZERO_ADDRESS &&
              isSameAddress(newOwner, account)
            ) {
              toast.info('poll caught')
              dispatch(fetchRegisterStateData({ provider, account })).catch(console.error)
              break
            }
            if (sleepCount === i++) {
              setListen(false)
              throw new Error('RelayServer failed to set its owner on the StakeManager')
            }
          }
        }
      }
      askIfOwnerIsSet().catch(toast.error)
    }
  }, [listen, account, dispatch, provider, refetch, stakeInfo])

  return <span>{listen.toString()}</span>
}
