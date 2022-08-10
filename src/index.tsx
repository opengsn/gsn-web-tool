import ReactDOM from 'react-dom/client'
import { WagmiConfig, createClient, configureChains, Chain } from 'wagmi'
import { rinkeby, goerli, optimismKovan, polygonMumbai, arbitrumRinkeby, ropsten } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'
import { providers, getDefaultProvider } from 'ethers'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import App from './routes/App'
import store from './store'
import { Provider } from 'react-redux'

import { ErrorBoundary } from './components/ErrorBoundary'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { Address } from '@opengsn/common'

export interface ChainWithStakingTokens extends Chain {
  stakingTokens?: Address[]
}

const avalancheFuji: ChainWithStakingTokens = {
  id: 43_114,
  name: 'Avalanche Fuji Testnet',
  network: 'avalancheFuji',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX'
  },
  rpcUrls: {
    default: 'https://api.avax-test.network/ext/bc/C/rpc'
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' }
  },
  testnet: true
}

const arbitrumNitro: ChainWithStakingTokens = {
  id: 421612,
  name: 'Arbitrum Nitro Testnet',
  network: 'arbitrum-nitro',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: 'https://nitro-devnet.arbitrum.io/rpc'
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://nitro-devnet-explorer.arbitrum.io/' }
  },
  testnet: true
}

const localhost: ChainWithStakingTokens = {
  id: 1337,
  name: 'testnet gsn',
  network: 'gsn-test',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: 'https://8545-opengsn-gsn-u4t84vx26oz.ws-eu59.gitpod.io/'
  },
  blockExplorers: {
    default: { name: 'GoChain Testnet explorer', url: 'https://localhost.com' }
  },
  testnet: true
}

const goTestnet: ChainWithStakingTokens = {
  id: 43_114,
  name: 'GO Chain testnet',
  network: 'go-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'GO Token',
    symbol: 'GO'
  },
  rpcUrls: {
    default: 'https://testnet-rpc.gochain.io'
  },
  blockExplorers: {
    default: { name: 'GoChain Testnet explorer', url: 'https://testnet-explorer.gochain.io' }
  },
  testnet: true
}

const availableChains = [ropsten, goerli, optimismKovan, avalancheFuji, polygonMumbai, arbitrumRinkeby, arbitrumNitro, goTestnet, localhost]

const wrappedNativeCurrency: { [key: string]: Address } = {
  'gsn-test': '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  ropsten: '0x1368e39E3CB40C3dFb06d2cB8E5fca6a847D16E6',
  goerli: '0xE8172A9bf53001d2796825AeC32B68e21FDBb869',
  'optimisn-kovan': '0x0b9D225C6A347eC2D12F664b85CB11B735BFc86d',
  'go-testnet': '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d',
  'avalanche-fuji': '0xb4Bbb5e968e278C6541addBC24b903712746f102',
  maticmum: '0xBA03B53D826207c39453653f655d147d4BCBA7B4',
  'arbitrum-rinkeby': '0x4C6cc053d802fF96952c825CB4c490c4A5E59f88',
  'arbitrum-nitro': '0xE1594A543399953A65E88570927A89765b6d06d1'
}

const allChainsWithWrapped: ChainWithStakingTokens[] = availableChains.map((chain) => {
  return { ...chain, stakingTokens: [wrappedNativeCurrency[chain.network]] }
})

const { chains } = configureChains(allChainsWithWrapped, [publicProvider()])

const metamaskIsInstalled = window.ethereum?.isMetaMask

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider: (config) => {
    if (metamaskIsInstalled === true) {
      const provider = new providers.Web3Provider(window.ethereum as providers.ExternalProvider, 'any')
      return provider
    }

    return getDefaultProvider(config.chainId)
  }
})

const root = ReactDOM.createRoot(document.getElementById('root') as Element)

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <WagmiConfig client={client}>
          <Routes>
            <Route path="/" element={<App />} />
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
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>)
