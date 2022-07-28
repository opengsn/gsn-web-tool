import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockConnector, MockProvider } from '@wagmi/core/connectors/mock'
import { WagmiConfig, createClient } from 'wagmi'
import { hardhat } from '@wagmi/core/chains'
import { connect, disconnect } from '@wagmi/core'
import { QueryClient } from 'react-query'
import store from './store'
import { Provider } from 'react-redux'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import App from './routes/App'
import { getSigners } from './test/utils'
import Relay from './feature/Relay/Relay'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent Jest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false
    }
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => { },
    log: console.log,
    warn: console.warn
  }
})

const mockProvider = new MockProvider({ chainId: 31337, signer: getSigners()[0] })
const WagmiConfigWrapper = ({ children }: any) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <WagmiConfig client={client}>
          <Routes>
            <Route path="/" element={children} />
          </Routes>
        </WagmiConfig>
      </BrowserRouter>
    </Provider>
  )
}
const client = createClient({
  autoConnect: false,
  connectors: [
    new MockConnector({
      chains: [hardhat],
      options:
      {
        chainId: 31337,
        signer: getSigners()[0],
        flags: {
          noSwitchChain: false
        }
      }
    })
  ],
  provider: mockProvider,
  queryClient
})


describe('without wallet connected', () => {
  test('renders connect with mock connector button if connect', async () => {
    render(<App />, { wrapper: WagmiConfigWrapper })
    const linkElement = screen.getByRole('button', { name: /connect with mock/i })
    expect(linkElement).toBeInTheDocument()
  })

})

describe('with wallet connected', () => {
  beforeAll(async () => {
    await connect({ chainId: 31337, connector: client.connectors[0] })
  })
  beforeEach(() => {
    render(<Relay />, { wrapper: WagmiConfigWrapper })
  })

  afterEach(cleanup)

  test('does not render connect with  mock connector button if not connected', async () => {
    const linkElement = screen.queryByText(/connect with mock/i)
    expect(linkElement).not.toBeInTheDocument()
  })

  // test('fetch relay data from url form should appear', async () => {
  //   const relayUrl = 'test'
  //   const formElement = screen.getByLabelText('Relay URL')
  //   await userEvent.type(formElement, relayUrl)
  //   expect(formElement).toHaveValue(relayUrl)
  // })

  test('fetch relay data from url should appear', async () => {
    const fetchRelayDataButton = screen.getByRole('button', { name: /fetch data/i })
    expect(fetchRelayDataButton).toBeInTheDocument()
  })

  describe('relay url transformation', () => {
    afterEach(async () => {
      const switchRelayBtn = screen.getByRole('button', { name: /switch relay/i })
      await userEvent.click(switchRelayBtn)
    })

    const urlFormats = ['http://localhost.com/getaddr/'
      , 'http://localhost.com/getaddr'
      , 'https://localhost.com/getaddr/'
      , 'https://localhost.com/getaddr'
      , 'http://localhost.com/'
      , 'http://localhost.com'
      , 'https://localhost.com'
      , 'localhost.com']

    urlFormats.forEach((i) => {
      it(`works correctly for ${i}`, async () => {
        const user = userEvent.setup()
        const fetchRelayDataButton = screen.getByRole('button', { name: /fetch data/i })
        const input = screen.getByLabelText('Relay URL')
        await user.type(input, i)

        await user.click(fetchRelayDataButton)
        expect(global.window.location.href).toMatch(/.*https%3A%2F%2F.*%2Fgetaddr$/i)
      })
    })
  })

  // test('fetch relay data from url form should appear', async () => {
  //   const relayUrl = 'test'
  //   const formElement = screen.getByLabelText('Relay URL')
  //   await userEvent.type(formElement, relayUrl)
  //   expect(formElement).toHaveValue(relayUrl)
  // })
})
