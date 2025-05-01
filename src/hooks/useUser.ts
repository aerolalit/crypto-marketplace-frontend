import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../constants/config';
import { useAuth } from './useAuth';

export interface UserProfile {
    userId: string;
    bio: string;
    links: {
        url: string;
        name: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    walletAddress: string;
    username: string | null;
    email: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    profile: UserProfile;
}

export const useUser = () => {
    const { token, isConnected } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        console.log('Fetching user data...', { token, isConnected });

        if (!token || !isConnected) {
            console.log('No token or not connected, skipping fetch');
            setUser(null);
            setError('Please connect your wallet to view your profile');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            console.log('Making API request to /users/me');
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log('API response status:', response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Your session has expired. Please reconnect your wallet.');
                }
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            console.log('User data received:', data);
            setUser(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching user data';
            console.error('Error fetching user:', err);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('useUser effect triggered', { token, isConnected });
        if (token && isConnected) {
            fetchUser();
        }
    }, [token, isConnected]); // Re-fetch when token or connection status changes

    return {
        user,
        isLoading,
        error,
        refetchUser: fetchUser
    };
}; 