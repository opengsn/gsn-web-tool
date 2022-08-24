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
import RelaysList from './feature/RelaysList/RelaysList'
import { getNetworks, ChainWithGsn } from './networks'

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector()],
  provider: (config) => {
    if (config.chainId !== undefined) {
      const provider = new providers.Web3Provider(window.ethereum as providers.ExternalProvider, config.chainId)
      return provider
    }

    return getDefaultProvider()
  }
})

const root = ReactDOM.createRoot(document.getElementById('root') as Element)
const wrappedApp = <WagmiConfig client={client}><App /></WagmiConfig>

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<RelaysList />} />
          <Route path="/manage" element={wrappedApp} />
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
      </ErrorBoundary>
    </BrowserRouter>
  </Provider >)
