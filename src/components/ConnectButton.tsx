import { ConnectButton as RainbowKitConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export function ConnectButton() {
    const { isConnected, signIn, hasRequestedSignature, messageToSign } = useAuth();

    useEffect(() => {
        // Only trigger sign in when we have a message to sign and haven't requested signature yet
        if (isConnected && messageToSign && !hasRequestedSignature) {
            signIn();
        }
    }, [isConnected, messageToSign, hasRequestedSignature, signIn]);

    return <RainbowKitConnectButton />;
} 