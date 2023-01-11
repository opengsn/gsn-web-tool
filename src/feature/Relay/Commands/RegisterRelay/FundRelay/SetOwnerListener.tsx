import { useContext, useEffect } from 'react'
import { useAccount, useContractEvent, useContractRead, useProvider } from 'wagmi'
import { constants } from 'ethers'

import { fetchRegisterStateData } from '../registerRelaySlice'

import { useAppDispatch } from '../../../../../hooks'
import { FunderContext } from './Funder'

import StakeManager from '../../../../../contracts/StakeManager.json'
import { isSameAddress, sleep } from '../../../../../utils/utils'
import { toast } from 'react-toastify'

export default function SetOwnerListener () {
  const dispatch = useAppDispatch()
  const { address: account } = useAccount()
  const funderData = useContext(FunderContext)

  const {
    listen,
    setListen,
    stakeManagerAddress,
    relayManagerAddress,
    chainId
  } = funderData
  const provider = useProvider({ chainId })

  useContractEvent({
    address: stakeManagerAddress as any,
    abi: StakeManager.abi,
    chainId,
    eventName: 'OwnerSet',
    listener: () => {
      if (!listen && account !== undefined) {
        dispatch(fetchRegisterStateData({ provider, account }))
          .catch(console.error)
      }
    }
  })

  const { data: stakeInfo, refetch } = useContractRead({
    address: stakeManagerAddress as any,
    abi: StakeManager.abi,
    args: [relayManagerAddress],
    functionName: 'getStakeInfo',
    chainId,
    watch: false
  })

  useEffect(() => {
    if (listen && account !== undefined && stakeInfo !== undefined) {
      const { owner } = (stakeInfo as any)[0]

      const askIfOwnerIsSet = async () => {
        const sleepCount = 15
        const sleepMs = 5000
        if (owner === constants.AddressZero) {
          let i = 0
          while (true) {
            console.debug(`Waiting ${sleepMs}ms ${i}/${sleepCount} for relayer to set (us) as owner`)
            await sleep(sleepMs)
            const newStakeInfo = (await refetch())
            if (newStakeInfo.data === undefined) {
              throw new Error('Failed to refetch StakeManager data')
            }
            const newOwner = (newStakeInfo.data as any)[0].owner
            if (
              newOwner !== constants.AddressZero &&
              isSameAddress(newOwner, account)
            ) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listen, account, dispatch, provider, refetch, stakeInfo])

  return <></>
}
