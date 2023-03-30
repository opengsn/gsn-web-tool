import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import GlobalWagmiWarpper from './feature/blockchain/GlobalWagmiWrapper'
import store from './store'

import { ErrorBoundary } from './components/ErrorBoundary'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import './index.css'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'

const root = ReactDOM.createRoot(document.getElementById('root') as Element)

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router basename={process.env.PUBLIC_URL}>
        <ErrorBoundary>
          <GlobalWagmiWarpper />
          <ToastContainer
            position='top-right'
            autoClose={false}
            newestOnTop
            style={{ width: '45vw' }}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
          />
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  </Provider>
)
