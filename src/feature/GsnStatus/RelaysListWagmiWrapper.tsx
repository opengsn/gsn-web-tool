import { useEffect, useState } from 'react'

import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import ChainsList from './ChainsList'
import { useAppSelector } from '../../hooks'
import { ChainWithGsn } from '../../types'

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
  const { provider } = configureChains(
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const client = createClient({
    autoConnect: true,
    provider
  })
  return <WagmiConfig client={client}><ChainsList /></WagmiConfig>
}
