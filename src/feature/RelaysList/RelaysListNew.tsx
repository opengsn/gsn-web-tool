import { getDefaultProvider, providers } from 'ethers'
import { useEffect, useState } from 'react'
import { ChainProviderFn, Chain, configureChains, createClient, useNetwork, WagmiConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
// import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { ChainWithGsn, getNetworks } from '../../networks'
import RelayListHeader from './RelayListHeader'

export default function RelaysListNew () {
  const [gsnNetworks, setGsnNetworks] = useState<ChainWithGsn[] | null>(null)

  useEffect(() => {
    (async () => {
      const gsnNetworks = await getNetworks()
      setGsnNetworks(gsnNetworks)
      // if (provider !== undefined) {
      //   setLocalPublicProvider(provider)
      // }
    })().catch(console.error)
  }, [])

  if (gsnNetworks === null || gsnNetworks.length === 0) return <span>no</span>

  const { chains, provider } = configureChains(
    gsnNetworks,
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: chain.rpcUrls.default
        })
      }),
      publicProvider()
    ]
    // [publicProvider()]
    // [infuraProvider({ apiKey: 'f40be2b1a3914db682491dc62a19ad43' })]
  )
  // if (localPublicProvider === null) return <span>test</span>

  const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector({ chains })],
    provider
    // provider: (config) => {
    //   if (config.chainId !== undefined) {
    //     const provider = new providers.Web3Provider(window.ethereum as providers.ExternalProvider, config.chainId)
    //     return provider
    //   }

    //   return getDefaultProvider()
    // }
  })
  return <WagmiConfig client={client}><RelayListHeader></RelayListHeader></WagmiConfig>
}
