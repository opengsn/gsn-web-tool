import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import GlobalWagmiWarpper from './feature/blockchain/GlobalWagmiWrapper'
import store from './store'

import { ErrorBoundary } from './components/ErrorBoundary'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'

const root = ReactDOM.createRoot(document.getElementById('root') as Element)

root.render(
  <Provider store={store}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <ErrorBoundary>
        <GlobalWagmiWarpper />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider >)
