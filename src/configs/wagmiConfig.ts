import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

export const arbitrum = {
  id: 42161,
  name: 'Arbitrum One',
  network: 'arbitrum',
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  iconUrl: require('../assets/tokens/arbitrum.svg').default,
  iconBackground: 'transparent',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    alchemy: {
      http: ['https://arb-mainnet.g.alchemy.com/v2'],
      webSocket: ['wss://arb-mainnet.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://arbitrum-mainnet.infura.io/v3'],
      webSocket: ['wss://arbitrum-mainnet.infura.io/ws/v3'],
    },
    default: {
      http: ['https://arb1.arbitrum.io/rpc'],
    },
    public: {
      http: ['https://arb1.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
    },
    default: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
    },
  },
};

export const { chains, publicClient } = configureChains(
  [arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'dbdfb35612fc3a2b79fa04674495d5de',
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
