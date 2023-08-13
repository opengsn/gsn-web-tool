import { useEffect } from 'react'
import { useAccount, useContractEvent, useContractRead, useProvider } from 'wagmi'
import { constants } from 'ethers'

import { fetchRegisterStateData } from '../registerRelaySlice'

import { useAppDispatch, useAppSelector } from '../../../../../hooks'

import StakeManager from '../../../../../contracts/StakeManager.json'
import { isSameAddress, sleep } from '../../../../../utils/utils'
import { toast } from 'react-toastify'

interface IProps {
  listen: boolean
  setListen: React.Dispatch<React.SetStateAction<boolean>>
  stakeManagerAddress: string
  relayManagerAddress: string
  chainId: number
  setError: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SetOwnerListener({ listen, setListen, stakeManagerAddress, relayManagerAddress, chainId, setError }: IProps) {
  const dispatch = useAppDispatch()
  const currentStep = useAppSelector((state) => state.register.step)
  const { address: account } = useAccount()

  const provider = useProvider({ chainId })

  useContractEvent({
    address: stakeManagerAddress as any,
    abi: StakeManager.abi,
    chainId,
    eventName: 'OwnerSet',
    listener: () => {
      if (!listen && account !== undefined && currentStep === 0) {
        dispatch(fetchRegisterStateData({ provider, account })).catch(console.error)
      }
    }
  })

  const { data: stakeInfo, refetch } = useContractRead({
    address: stakeManagerAddress as any,
    abi: StakeManager.abi,
    args: [relayManagerAddress],
    functionName: 'getStakeInfo',
    chainId,
    enabled: false
  })

  useEffect(() => {
    if (listen && account !== undefined && stakeInfo !== undefined && currentStep === 0) {
      setError(false)
      const { owner } = (stakeInfo as any)[0]
      const askIfOwnerIsSet = async () => {
        const sleepCount = 15
        const sleepMs = 5000
        if (owner === constants.AddressZero) {
          let i = 0
          while (true) {
            console.debug(`Waiting ${sleepMs}ms ${i}/${sleepCount} for relayer to set (us) as owner`)
            const newStakeInfo = await refetch()
            if (newStakeInfo.data === undefined) {
              throw new Error('Failed to refetch StakeManager data')
            }
            const newOwner = (newStakeInfo.data as any)[0].owner
            if (newOwner !== constants.AddressZero && isSameAddress(newOwner, account)) {
              dispatch(fetchRegisterStateData({ provider, account })).catch(console.error)
              break
            }
            if (sleepCount === i++) {
              setError(true)
              console.error('RelayServer failed to set its owner on the StakeManager')
              setListen(false)
              break
            }
            await sleep(sleepMs)
          }
        }
      }
      askIfOwnerIsSet().catch(toast.error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listen, account, dispatch, provider, refetch, stakeInfo, currentStep])

  return <></>
}
