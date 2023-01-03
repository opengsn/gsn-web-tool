import { getDefaultProvider, providers } from 'ethers'
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { Route, Routes } from 'react-router-dom'

import Container from 'react-bootstrap/Container'

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

export default function GlobalWagmiWarpper () {
  const [gsnNetworks, setGsnNetworks] = useState<ChainWithGsn[]>([])
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchNets = async () => {
      try {
        if (gsnNetworks.length === 0) {
          const networksForWagmi: ChainWithGsn[] = await getNetworks()
          dispatch(fetchNetworks({ networks: networksForWagmi })).catch(console.error)
          setGsnNetworks(networksForWagmi)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchNets().catch(console.error)
  }, [dispatch, gsnNetworks.length])

  const LoadingCentered =
    <div className="d-flex align-items-center justify-content-center vh-100 bg-white">
      <div>
        <Spinner variant="success" animation="grow"></Spinner>
      </div>
    </div>

  if (gsnNetworks.length === 0) return LoadingCentered
  const { chains, provider: wagmiProvider } = configureChains(
    gsnNetworks,
    [
      infuraProvider({ apiKey: 'f40be2b1a3914db682491dc62a19ad43' }),
      jsonRpcProvider({
        rpc: (chain) => ({
          http: chain.rpcUrls.default.http[0]
        })
      }),
      publicProvider()
    ]
  )

  // used when the RPC URL is only available through MetaMask connection
  // but prefers preconfigured RPC as JsonRpcProvider if available in gsn-networks.json
  const configureProvider = (config: { chainId?: number }) => {
    if (config.chainId !== undefined) {
      const configuredNetwork = gsnNetworks.find(x => x.id === config.chainId)
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
      <Container fluid className="p-2">
        <Routes>
          <Route path={ROUTES.List} element={<GsnRelaysView />} />
          <Route path={ROUTES.DetailedView} element={<RelayDetailedView />} />
          <Route path={ROUTES.RegisterNew} element={<RegisterNewRelay />} />
        </Routes>
      </Container>
    </WagmiConfig>
  )
}
