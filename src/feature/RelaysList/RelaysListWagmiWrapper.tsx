import { useEffect, useState } from 'react'

import { configureChains, createClient } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { ChainWithGsn } from '../../networks'
import ChainsList from './ChainsList'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchNetworks } from './networkListSlice'

export default function RelaysListWagmiWrapper () {
  const [gsnNetworks, setGsnNetworks] = useState<ChainWithGsn[] | null>(null)
  const networks = useAppSelector((state) => state.networkList.networks)

  useEffect(() => {
    const networkKeys = Object.keys(networks)
    if (networkKeys.length > 0 && gsnNetworks === null) {
      const wagmiChains = networkKeys.map(x => networks[x as unknown as number].chain)
      setGsnNetworks(wagmiChains)
    }
  }, [networks, gsnNetworks])

  if (gsnNetworks === null) return <></>
  const { chains, provider } = configureChains(
    gsnNetworks,
    [
      infuraProvider({ apiKey: 'f40be2b1a3914db682491dc62a19ad43' }),
      jsonRpcProvider({
        rpc: (chain) => {
          return ({
            http: chain.rpcUrls.default
          })
        },
        static: true
      })
    ]
  )

  const client = createClient({
    connectors: [new InjectedConnector({ chains })],
    provider
  })

  return <ChainsList />
}
