import { getDefaultProvider, providers } from 'ethers'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { configureChains, createClient, WagmiConfig } from 'wagmi'

import { InjectedConnector } from 'wagmi/connectors/injected'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

import { useAppDispatch } from '../../hooks'
import { ROUTES } from '../../constants/routes'
import { GsnRelaysView, RegisterNewRelay, RelayDetailedView } from '../../routes'
import { ChainWithGsn } from '../../types'
import { fetchNetworks } from '../GsnStatus/networkListSlice'
import { getNetworks } from './networks'
import { Box } from '../../components/atoms'
import Header from '../../components/organiasms/Header'

export default function GlobalWagmiWarpper() {
  const path = useLocation().pathname
  const [gsnNetworks, setGsnNetworks] = useState<ChainWithGsn[]>([])
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchNets = async () => {
      try {
        if (gsnNetworks.length === 0) {
          const networksForWagmi: ChainWithGsn[] = await getNetworks()
          if (path === ROUTES.List) dispatch(fetchNetworks({ networks: networksForWagmi }))
          setGsnNetworks(networksForWagmi)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchNets().catch((e) => {
      console.error(e)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, gsnNetworks.length])

  if (gsnNetworks.length === 0) return <>loading...</>
  const { chains, provider: wagmiProvider } = configureChains(gsnNetworks, [
    infuraProvider({ apiKey: 'f40be2b1a3914db682491dc62a19ad43' }),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0]
      })
    }),
    publicProvider()
  ])

  // used when the RPC URL is only available through MetaMask connection
  // but prefers preconfigured RPC as JsonRpcProvider if available in gsn-networks.json
  const configureProvider = (config: { chainId?: number }) => {
    if (config.chainId !== undefined) {
      const configuredNetwork = gsnNetworks.find((x) => x.id === config.chainId)
      if (configuredNetwork !== undefined && config.chainId !== undefined && config.chainId !== 1337) {
        return new providers.JsonRpcProvider(configuredNetwork.rpcUrls.default.http[0], configuredNetwork.id)
      }
      const provider = new providers.Web3Provider(window.ethereum as providers.ExternalProvider, config.chainId)
      return provider
    } else {
      return getDefaultProvider()
    }
  }

  let provider
  if (window.ethereum?.isMetaMask) {
    provider = configureProvider
  } else {
    provider = wagmiProvider
  }

  const client = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector({ chains })],
    provider
  })

  return (
    <WagmiConfig client={client}>
      <Header />
      <Box>
        <Routes>
          <Route path={ROUTES.List} element={<GsnRelaysView />} />
          <Route path={ROUTES.DetailedView} element={<RelayDetailedView />} />
          <Route path={ROUTES.RegisterNew} element={<RegisterNewRelay />} />
        </Routes>
      </Box>
    </WagmiConfig>
  )
}
