import { Chain } from 'wagmi'

export interface ChainWithGsn extends Chain {
  gsn: {
    relayHubAddress: string
    RelayHubAbi: any
    contracts: any
    group: string
  }
  stakingTokens?: string[]
}
