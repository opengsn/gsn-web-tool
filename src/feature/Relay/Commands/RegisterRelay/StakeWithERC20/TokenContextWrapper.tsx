import { useEffect, useState, createContext, ReactNode } from 'react'
import { ethers, constants } from 'ethers'
import { useAccount, useContract, useContractRead, useBlockNumber, useProvider, useNetwork } from 'wagmi'
import gsnNetworks from '../../../../blockchain/gsn-networks.json'

import { useAppSelector, useLocalStorage, useStakeManagerAddress } from '../../../../../hooks'

import { isSameAddress, toNumber } from '../../../../../utils'

import RelayHub from '../../../../../contracts/RelayHub.json'
import StakeManager from '../../../../../contracts/StakeManager.json'

import { ChainWithGsn } from '../../../../../types'

export interface TokenContextInterface {
  chainId: number
  token: string
  account?: string
  minimumStakeForToken: ethers.BigNumber | null
  stakeManagerAddress: string
  listen: boolean
  setListen: React.Dispatch<React.SetStateAction<boolean>>
  handleFindFirstTokenButton: () => Promise<string>
  chain: ChainWithGsn
  setToken: (value: string) => void
  explorerLink: string | null
}

export const TokenContext = createContext<TokenContextInterface>({} as TokenContextInterface)

interface IProps {
  children: ReactNode
}

export default function TokenContextWrapper({ children }: IProps) {
  const [token, setToken] = useLocalStorage('token', '')
  const [minimumStakeForToken, setMinimumStakeForToken] = useState<ethers.BigNumber | null>(null)
  const [listen, setListen] = useState(false)
  const relay = useAppSelector((state) => state.relay.relay)
  const chainId = Number(relay.chainId)
  const currentStep = useAppSelector((state) => state.register.step)
  const explorerLink = chainId ? (gsnNetworks as any)?.[chainId]?.[0].explorer : null

  useEffect(() => {
    console.log('currentStep', currentStep)
  }, [currentStep])

  const { address } = useAccount()
  const { chain: chainData } = useNetwork()
  const chain = chainData as unknown as ChainWithGsn

  const { relayManagerAddress, relayHubAddress } = relay

  const provider = useProvider()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const relayHub = useContract({
    address: relayHubAddress,
    abi: RelayHub.abi,
    signerOrProvider: provider
  })!

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relayHubAddress, chainId)
  const stakeManagerAddress = stakeManagerAddressData as any

  const { data: newStakeInfoData } = useContractRead({
    address: stakeManagerAddress,
    abi: StakeManager.abi,
    args: [relayManagerAddress],
    chainId,
    functionName: 'getStakeInfo'
  })

  const { data: curBlockData } = useBlockNumber({
    chainId
  })

  const handleFindFirstTokenButton = async () => {
    if (curBlockData !== undefined) {
      const fromBlock = (await relayHub.functions.getCreationBlock())[0]
      const toBlock = Math.min(toNumber(fromBlock) + 2048, curBlockData)

      const filters = relayHub.filters.StakingTokenDataChanged()
      const tokens = await relayHub.queryFilter(filters, fromBlock._hex, toBlock)

      if (tokens.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        throw new Error(`no registered staking tokens on relayhub ${relayHub.address as string}`)
      }
      const foundToken = tokens[0]?.args?.token
      return foundToken
    }
  }

  useEffect(() => {
    if (newStakeInfoData !== undefined && address !== undefined) {
      const newStakeInfo = (newStakeInfoData as any)[0]

      if (newStakeInfo?.owner !== constants.AddressZero && isSameAddress(newStakeInfo?.owner, address)) {
        if (newStakeInfo?.token !== constants.AddressZero) {
          setToken(newStakeInfo.token)
        }
      }
    }
  }, [newStakeInfoData, address, setToken])

  useEffect(() => {
    const fetchMinimumStakeForToken = async () => {
      const minimumStake = await relayHub.functions.getMinimumStakePerToken(token)
      setMinimumStakeForToken(minimumStake[0])
    }
    if (token !== null) {
      fetchMinimumStakeForToken()
    }
  }, [token, relayHub.functions])

  return (
    <TokenContext.Provider
      value={{
        chainId,
        token,
        account: address,
        minimumStakeForToken,
        stakeManagerAddress,
        listen,
        setListen,
        handleFindFirstTokenButton,
        chain,
        setToken,
        explorerLink
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
