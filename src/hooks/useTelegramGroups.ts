import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../constants/config';
import { useAuth } from './useAuth';

interface TelegramPhoto {
    big_file_id: string;
    small_file_id: string;
    big_file_unique_id: string;
    small_file_unique_id: string;
}

interface TelegramUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string | null;
    photoUrl: string;
    authDate: number;
    hash: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

interface User {
    id: string;
    walletAddress: string;
    username: string | null;
    email: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

interface SubscriptionPlanDetails {
    price?: string;
    duration?: number;
    tokenAddress?: string;
    requiredAmount?: string;
}

interface SubscriptionPlan {
    groupId: string;
    id: number;
    userId: string;
    type: 'one-time' | 'token-holding';
    details: SubscriptionPlanDetails;
    createdAt: string;
    updatedAt: string;
}

export interface TelegramGroup {
    id: string;
    userId: string;
    title: string;
    type: string;
    memberCount: number;
    addedById: string;
    photo: TelegramPhoto;
    botPermissions: string[];
    createdAt: string;
    updatedAt: string;
    addedBy: TelegramUser;
    user: User;
    subscriptionPlans: SubscriptionPlan[];
}

export const useTelegramGroups = () => {
    const [groups, setGroups] = useState<TelegramGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    const fetchedRef = useRef(false);

    const fetchGroupsFromApi = async () => {
        if (!token) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/telegram/groups/my-groups`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch telegram groups');
            }

            const data = await response.json();
            setGroups(data);
            fetchedRef.current = true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && !fetchedRef.current) {
            fetchGroupsFromApi();
        }
    }, [token]);

    const redirectToTelegramAuth = () => {
        // Replace with your actual Telegram login URL
        window.location.href = `${API_BASE_URL}/auth/telegram`;
    };

    return {
        groups,
        loading,
        error,
        fetchGroups: fetchGroupsFromApi,
        redirectToTelegramAuth
    };
}; 