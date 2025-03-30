import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import { SUPPORTED_CHAINS } from './constants/config';

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID environment variable');
}

const chains = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  ...(SUPPORTED_CHAINS.sepolia ? [sepolia] : []),
];

export const config = getDefaultConfig({
  appName: 'Crypto Marketplace',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains,
  ssr: true,
});
