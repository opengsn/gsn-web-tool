import ReactDOM from "react-dom/client";
import {WagmiConfig, createClient, chain} from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { providers } from "ethers";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import App from "./routes/App";
import store from "./store";
import {Provider} from "react-redux";

import { ErrorBoundary } from "./components/ErrorBoundary";

import 'bootstrap/dist/css/bootstrap.min.css';

const ethProvider = new providers.JsonRpcProvider(process.env.RPC_URL, providers.getNetwork('1337'));
const connector = new MetaMaskConnector({chains: [chain.hardhat]});

const client = createClient({
  autoConnect: true,
  provider: ethProvider,
  connectors: [connector]
})

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
      <WagmiConfig client={client}>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </WagmiConfig>
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);

