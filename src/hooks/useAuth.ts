import { useAccount, useSignMessage } from 'wagmi';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchApi } from '../utils/api';
import { AUTH_TOKEN_KEY } from '../constants/config';

interface AuthResponse {
    token: string;
    user: {
        id: string;
        walletAddress: string;
        username: string | null;
        email: string | null;
        emailVerified: boolean;
        createdAt: string;
        updatedAt: string;
    };
}

interface MessageResponse {
    message: string;
}

const USER_DATA_KEY = 'userData';

const isBrowser = typeof window !== 'undefined';

const getStoredUserId = () => {
    if (!isBrowser) return null;
    const storedUser = localStorage.getItem(USER_DATA_KEY);
    return storedUser ? JSON.parse(storedUser).id : null;
};

export function useAuth() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [messageToSign, setMessageToSign] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(getStoredUserId);
    const wasConnected = useRef(false);

    // Reset states when wallet disconnects
    useEffect(() => {
        if (!isConnected && wasConnected.current) {
            setMessageToSign(null);
            setUserId(null);
            if (isBrowser) {
                localStorage.removeItem(AUTH_TOKEN_KEY);
                localStorage.removeItem(USER_DATA_KEY);
            }
        }
        wasConnected.current = isConnected;
    }, [isConnected]);

    // Get message to sign
    const { data: messageData } = useQuery<MessageResponse>({
        queryKey: ['authMessage'],
        queryFn: async () => {
            const { data, error } = await fetchApi<MessageResponse>('/auth/message');
            if (error) throw new Error(error);
            return data;
        },
        enabled: isConnected && !messageToSign && !localStorage.getItem(AUTH_TOKEN_KEY),
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
        if (!messageToSign || !address) return null;

        try {
            // Sign the message
            const signature = await signMessageAsync({ message: messageToSign });

            // Verify the signature
            const { token, user } = await verifySignature({
                signature,
                message: messageToSign,
            });

            // Store the token and user data, and clear message
            if (isBrowser) {
                localStorage.setItem(AUTH_TOKEN_KEY, token);
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
            }
            setUserId(user.id);
            setMessageToSign(null);

            return token;
        } catch (error) {
            console.error('Authentication failed:', error);
            return null;
        }
    }, [messageToSign, address, signMessageAsync, verifySignature]);

    return {
        isConnected,
        signIn,
        messageToSign,
        userId,
    };
} 