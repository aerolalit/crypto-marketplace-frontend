export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const AUTH_TOKEN_KEY = 'authToken';

export const TELEGRAM_BOT_NAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'Invite_manager1_bot';

export const SUPPORTED_CHAINS = {
    mainnet: true,
    polygon: true,
    optimism: true,
    arbitrum: true,
    base: true,
    sepolia: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true',
}; 