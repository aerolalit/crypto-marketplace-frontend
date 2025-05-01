import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { UpdateUserProfileDto, UserProfile } from '../types/profile';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../constants/config';

export const useProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const { isConnected } = useAuth();

    const getAuthHeaders = (): Record<string, string> => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchProfile = useCallback(async (userId: string) => {
        if (!isConnected) return;

        setIsLoading(true);
        setError(null);

        try {
            const headers: HeadersInit = {
                ...getAuthHeaders()
            };

            const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
                headers
            });
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        } finally {
            setIsLoading(false);
        }
    }, [isConnected]);

    const updateProfile = useCallback(async (userId: string, data: UpdateUserProfileDto) => {
        if (!isConnected) return;

        setIsLoading(true);
        setError(null);

        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            };

            const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            return updatedProfile;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [isConnected]);

    return {
        profile,
        isLoading,
        error,
        fetchProfile,
        updateProfile,
    };
}; 