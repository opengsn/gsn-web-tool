import { useEffect, useState } from 'react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'

import Relay from '../feature/Relay/Relay'

import NavigateBackButton from '../feature/Relay/NavigateBackButton'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import RelaysListWagmiWrapper from '../feature/RelaysList/RelaysListWagmiWrapper'
import { ChainWithGsn, getNetworks } from '../networks'
import { useAppDispatch } from '../hooks'
import { fetchNetworks } from '../feature/RelaysList/networkListSlice'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { infuraProvider } from 'wagmi/providers/infura'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { getDefaultProvider, providers } from 'ethers'
import { Spinner } from 'react-bootstrap'

export default function App () {
  const [gsnNetworks, setGsnNetworks] = useState<ChainWithGsn[]>([])
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchNets = async () => {
      try {
        const networksForWagmi: ChainWithGsn[] = await getNetworks()
        setGsnNetworks(networksForWagmi)
        dispatch(fetchNetworks()).catch(console.error)
      } catch (e) {
        console.error(e)
      }
    }
    fetchNets().catch(console.error)
  }, [dispatch])

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
        rpc: (chain) => {
          return ({
            http: chain.rpcUrls.default
          })
        },
        static: true
      })
    ]
  )

  // used when the RPC URL is only available through MetaMask connection
  // but prefers preconfigured RPC as JsonRpcProvider if available in gsn-networks.json
  const configureProvider = (config: { chainId?: number }) => {
    if (config.chainId !== undefined) {
      const configuredNetwork = gsnNetworks.find(x => x.id === config.chainId)
      if (configuredNetwork !== undefined && config.chainId !== undefined && config.chainId !== 1337) {
        return new providers.JsonRpcProvider(configuredNetwork.rpcUrls.default, configuredNetwork.id)
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

  const RelayExtendedViewContainer = () => {
    return (<div className="App">
      <header className="text-center text-white bg-danger">EXPERIMENTAL</header>
      <Container fluid className="my-1">
        <Row>
          <NavigateBackButton />
          <Relay />
        </Row>
      </Container>
    </div>)
  }

  return (
    <WagmiConfig client={client}>
      <Routes>
        <Route path="/" element={<RelaysListWagmiWrapper />} />
        <Route path="/manage" element={<RelayExtendedViewContainer />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={false}
        newestOnTop
        style={{ width: '45vw' }}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
      />
    </WagmiConfig>
  )
}
