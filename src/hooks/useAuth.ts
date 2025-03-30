import { useAccount, useSignMessage } from 'wagmi';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../utils/api';
import { AUTH_TOKEN_KEY } from '../constants/config';

interface AuthResponse {
    token: string;
}

interface MessageResponse {
    message: string;
}

export function useAuth() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [hasRequestedSignature, setHasRequestedSignature] = useState(false);
    const [messageToSign, setMessageToSign] = useState<string | null>(null);

    // Reset states when wallet disconnects
    useEffect(() => {
        if (!isConnected) {
            setHasRequestedSignature(false);
            setMessageToSign(null);
        }
    }, [isConnected]);

    // Get message to sign
    const { data: messageData } = useQuery<MessageResponse>({
        queryKey: ['authMessage'],
        queryFn: async () => {
            const { data, error } = await fetchApi<MessageResponse>('/auth/message');
            if (error) throw new Error(error);
            return data;
        },
        enabled: isConnected && !hasRequestedSignature && !messageToSign,
    });

    // Update messageToSign when messageData changes
    useEffect(() => {
        if (messageData?.message) {
            setMessageToSign(messageData.message);
        }
    }, [messageData]);

    // Verify signature
    const { mutateAsync: verifySignature } = useMutation({
        mutationFn: async ({ signature, message }: { signature: string; message: string }) => {
            const { data, error } = await fetchApi<AuthResponse>('/auth/verify', {
                method: 'POST',
                body: JSON.stringify({
                    address,
                    signature,
                    message,
                }),
            });
            if (error) throw new Error(error);
            return data;
        },
    });

    const signIn = useCallback(async () => {
        if (!messageToSign || !address || hasRequestedSignature) return null;

        try {
            setHasRequestedSignature(true);

            // Sign the message
            const signature = await signMessageAsync({ message: messageToSign });

            // Verify the signature
            const { token } = await verifySignature({
                signature,
                message: messageToSign,
            });

            // Store the token
            localStorage.setItem(AUTH_TOKEN_KEY, token);

            // Clear the message after successful verification
            setMessageToSign(null);

            return token;
        } catch (error) {
            console.error('Authentication failed:', error);
            setHasRequestedSignature(false);
            return null;
        }
    }, [messageToSign, address, hasRequestedSignature, signMessageAsync, verifySignature]);

    return {
        isConnected,
        signIn,
        hasRequestedSignature,
        messageToSign,
    };
} 