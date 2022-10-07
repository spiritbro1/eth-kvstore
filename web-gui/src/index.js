import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RainbowKitProvider,getDefaultWallets,lightTheme } from '@rainbow-me/rainbowkit';
import "./styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum,chain.localhost],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'PGP signer',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
       <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider theme={lightTheme({
      accentColor: '#000000',
      accentColorForeground: 'white',
  
    })} chains={chains} modalSize="compact" initialChain={chain.localhost}>
      <App />
    </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
