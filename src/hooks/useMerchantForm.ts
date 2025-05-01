import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { API_BASE_URL } from '../constants/config';

export type Step = 'telegram_login' | 'search_group' | 'subscription_plan';

export type PlanType = 'token-holding' | 'one-time';

export interface TokenHoldingPlan {
    id?: string;
    type: 'token-holding';
    tokenAddress: string;
    requiredAmount: string;
}

export interface OneTimePlan {
    id?: string;
    type: 'one-time';
    duration: number;
    price: string;
}

export type SubscriptionPlan = TokenHoldingPlan | OneTimePlan;

const REQUIRED_PERMISSIONS = ['can_restrict_members', 'can_invite_users'] as const;

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

export interface TelegramGroup {
    id: string;
    title: string;
    memberCount: number;
    addedById: string;
    isVerified: boolean;
    verifiedAt: string | null;
    verifiedById: string | null;
    botPermissions: string[];
    createdAt: string;
    updatedAt: string;
    addedBy: {
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
    };
    verifiedBy: null | any;
    photoUrl?: string;
}

export interface Status {
    type: 'success' | 'error';
    message: string;
}

export const useMerchantForm = () => {
    const { t } = useTranslation('common');
    const [currentStep, setCurrentStep] = useState<Step>('telegram_login');
    const [selectedGroup, setSelectedGroup] = useState<TelegramGroup | null>(null);
    const [userGroups, setUserGroups] = useState<TelegramGroup[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<Status | null>(null);
    const [telegramUserId, setTelegramUserId] = useState<number | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [groupWithMissingPermissions, setGroupWithMissingPermissions] = useState<TelegramGroup | null>(null);
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

    const getGroupPhotoUrl = (groupId: string, size: 'small' | 'big' = 'small') => {
        return `${API_BASE_URL}/telegram/groups/${groupId}/photo?size=${size}`;
    };

    const checkGroupPermissions = (group: TelegramGroup): string[] => {
        return REQUIRED_PERMISSIONS.filter(permission => !group.botPermissions.includes(permission));
    };

    const fetchUserGroups = async (tgUserId: number) => {
        setIsLoading(true);
        setError(null);
        setTelegramUserId(tgUserId);
        try {
            const response = await fetch(`${API_BASE_URL}/telegram/groups-by-user?tgUserId=${tgUserId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch groups');
            }
            const data = await response.json();
            // Add photo URLs to each group
            const groupsWithPhotos = data.groups.map((group: TelegramGroup) => ({
                ...group,
                photoUrl: getGroupPhotoUrl(group.id)
            }));
            setUserGroups(groupsWithPhotos);
            setCurrentStep('search_group');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch groups');
            console.error('Error fetching groups:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExistingPlans = async (groupId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/telegram/groups/${groupId}/subscription-plans`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch subscription plans');
            }
            const data = await response.json();
            // Transform the API response format to match what the component expects
            const transformedPlans = data.map((plan: any) => ({
                id: plan.id.toString(),
                type: plan.type,
                ...(plan.type === 'token-holding'
                    ? {
                        tokenAddress: plan.details.tokenAddress,
                        requiredAmount: plan.details.requiredAmount,
                    }
                    : {
                        duration: plan.details.duration,
                        price: plan.details.price,
                    }
                )
            }));
            setPlans(transformedPlans);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch subscription plans');
            console.error('Error fetching subscription plans:', err);
            setPlans([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGroupSelect = async (group: TelegramGroup) => {
        const missingPermissions = checkGroupPermissions(group);
        if (missingPermissions.length > 0) {
            setGroupWithMissingPermissions(group);
            setShowPermissionModal(true);
            return;
        }
        setSelectedGroup(group);
        await fetchExistingPlans(group.id);
        setCurrentStep('subscription_plan');
    };

    const addPlan = (plan: Omit<SubscriptionPlan, 'id'>) => {
        // If the plan already has an ID (from existing subscriptions), preserve it
        if ('id' in plan) {
            setPlans((prev) => [...prev, plan as SubscriptionPlan]);
        } else {
            // For new plans without IDs, just add them as is
            setPlans((prev) => [...prev, plan as SubscriptionPlan]);
        }
    };

    const removePlan = (planId: string) => {
        setPlans((prev) => prev.filter((p) => p.id !== planId));
    };

    const handleSubmit = async () => {
        if (!selectedGroup) return;
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/telegram/groups/${selectedGroup.id}/subscription-plans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ plans }),
            });
            if (!response.ok) {
                throw new Error('Failed to create subscription plans');
            }
            setStatus({ type: 'success', message: t('merchant.listing.success') });
            setTimeout(() => {
                setCurrentStep('telegram_login');
                setSelectedGroup(null);
                setUserGroups([]);
                setPlans([]);
                setTelegramUserId(null);
                setShowPermissionModal(false);
                setGroupWithMissingPermissions(null);
                setStatus(null);
            }, 2000);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create subscription plans');
            setStatus({ type: 'error', message: t('merchant.listing.error') });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        currentStep,
        selectedGroup,
        userGroups,
        isLoading,
        error,
        status,
        telegramUserId,
        showPermissionModal,
        groupWithMissingPermissions,
        plans,
        REQUIRED_PERMISSIONS,
        setCurrentStep,
        setShowPermissionModal,
        fetchUserGroups,
        handleGroupSelect,
        addPlan,
        removePlan,
        handleSubmit,
        getGroupPhotoUrl,
        checkGroupPermissions,
    };
}; 