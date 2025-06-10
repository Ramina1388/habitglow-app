"use client";

import { ReactNode } from "react";
import {
  WagmiConfig,
  createClient,
  configureChains,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  RainbowKitProvider,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import "@rainbow-me/rainbowkit/styles.css";

const base = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org"],
    },
    public: {
      http: ["https://mainnet.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Basescan",
      url: "https://basescan.org",
    },
  },
};

const { chains, provider } = configureChains([base], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "HabitGlow",
  projectId: "demo",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MiniKitProvider chain={base}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </MiniKitProvider>
  );
}
