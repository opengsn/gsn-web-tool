import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockConnector, MockProvider } from '@wagmi/core/connectors/mock'
import { WagmiConfig, createClient } from 'wagmi'
import { hardhat } from '@wagmi/core/chains'
import { connect } from '@wagmi/core'
import { QueryClient } from 'react-query'
import store from './store'
import { Provider } from 'react-redux'

import App from './routes/App'
import { getSigners } from './test/utils'
import { link } from 'fs'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent Jest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => { },
    log: console.log,
    warn: console.warn,
  },
})

const mockProvider = new MockProvider({ chainId: 31337, signer: getSigners()[0] })

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
        },
      }
    }),
  ],
  provider: mockProvider,
  queryClient
})

const WagmiConfigWrapper = ({ children }: any) => {
  return (
    <Provider store={store}>
      <WagmiConfig client={client}>{children}</WagmiConfig>
    </Provider>
  )
}


test('renders connect with ... button if connect', async () => {
  const linkElement = screen.getByText(/connect with/i)
  expect(linkElement).toBeInTheDocument()
})

beforeEach(async () => {
  await waitFor(() => {
    const screen = render(<App />, { wrapper: WagmiConfigWrapper })
  })
})

describe('with wallet connected', () => {
  test('does not render connect with ... button if not connected', async () => {
    const linkElement = screen.queryByRole('button', { name: /connect with/i })
    await waitFor(async () => {
      await connect({ chainId: 31337, connector: client.connectors[0]! })
    })

    expect(linkElement).not.toBeInTheDocument()
  })

  test('fetch relay data from url form should appear', async () => {
    const relayUrl = 'test'
    const formElement = await screen.getByLabelText('Relay URL')
    await userEvent.type(formElement, relayUrl)
    // const formElement = screen.getByTestId('url')
    expect(formElement).toHaveValue(relayUrl)
  })

  test('fetch relay data from url should appear', async () => {
    const fetchRelayDataButton = await screen.getByRole('button', { name: /fetch data/i })
    expect(fetchRelayDataButton).toBeInTheDocument()

  })
})
