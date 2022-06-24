import ReactDOM from "react-dom/client";
import { WagmiConfig, configureChains, defaultChains, createClient, chain } from "wagmi";
// import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { InjectedConnector } from "wagmi/connectors/injected";
import { providers, getDefaultProvider, ethers } from "ethers";
import { publicProvider } from 'wagmi/providers/public'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import App from "./routes/App";
import store from "./store";
import { Provider } from "react-redux";

import { ErrorBoundary } from "./components/ErrorBoundary";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const metamaskIsInstalled = window.ethereum && window.ethereum.isMetaMask;

// const ethProvider = new providers.JsonRpcProvider("https://8545-qq7-gsn-8jeb69254es.ws-eu49.gitpod.io/", providers.getNetwork("1337"));

// const connector = new MetaMaskConnector({ chains: [chain.hardhat, chain.mainnet] });

const { chains, provider: ethProvider } = configureChains([...defaultChains, chain.hardhat], [
  publicProvider()
])

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector()],
  provider: (config) => {
    if (metamaskIsInstalled) {
      return new providers.Web3Provider(window.ethereum as providers.ExternalProvider)
    }

    return getDefaultProvider(config.chainId)
  }
});

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <WagmiConfig client={client}>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
          <ToastContainer
            toastClassName="test"
            position="top-right"
            autoClose={false}
            newestOnTop
            style={{ width: "45vw" }}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
          />
        </WagmiConfig>
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>);
