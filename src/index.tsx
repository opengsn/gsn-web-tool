import ReactDOM from 'react-dom/client'
import { WagmiConfig, createClient } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
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

const metamaskIsInstalled = window.ethereum?.isMetaMask

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector()],
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
