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
import "@rainbow-me/rainbowkit/styles.css";

// MiniKitProvider import removed

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
  projectId: "demo", // ✅ required for WalletConnect in RainbowKit
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {/* Removed MiniKitProvider to prevent overwriting farcaster.json */}
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
