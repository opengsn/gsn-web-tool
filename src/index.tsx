import ReactDOM from 'react-dom/client'
import { WagmiConfig, createClient, configureChains, Chain } from 'wagmi'
import { goerli, optimismKovan, polygonMumbai, arbitrumRinkeby, ropsten } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'
import { providers } from 'ethers'
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

const root = ReactDOM.createRoot(document.getElementById('root') as Element)

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider >)
