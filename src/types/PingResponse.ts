export interface PingResponse {
  relayWorkerAddress: string
  relayManagerAddress: string
  relayHubAddress: string
  ownerAddress: string
  minMaxPriorityFeePerGas: string
  maxAcceptanceBudget: string
  networkId?: string
  chainId?: string
  ready: boolean
  version: string
}