import { ConnectButton as RainbowKitConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export function ConnectButton() {
    const { isConnected, signIn, messageToSign } = useAuth();

    useEffect(() => {
        // Trigger sign in when we have a message to sign
        if (isConnected && messageToSign) {
            signIn();
        }
    }, [isConnected, messageToSign, signIn]);

    return <RainbowKitConnectButton />;
} 