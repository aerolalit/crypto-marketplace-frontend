export const API_BASE_URL = 'http://localhost:3001/api';

export const AUTH_TOKEN_KEY = 'authToken';

export const SUPPORTED_CHAINS = {
    mainnet: true,
    polygon: true,
    optimism: true,
    arbitrum: true,
    base: true,
    sepolia: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true',
}; 