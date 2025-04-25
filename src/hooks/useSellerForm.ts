import { useState } from 'react';
import { useTranslation } from 'next-i18next';

export type Step = 'telegram_login' | 'search_group' | 'verify_ownership' | 'set_price';

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

export const useSellerForm = () => {
    const { t } = useTranslation('common');
    const [currentStep, setCurrentStep] = useState<Step>('telegram_login');
    const [selectedGroup, setSelectedGroup] = useState<TelegramGroup | null>(null);
    const [userGroups, setUserGroups] = useState<TelegramGroup[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState<Status | null>(null);

    const getGroupPhotoUrl = (groupId: string, size: 'small' | 'big' = 'small') => {
        return `http://localhost:3001/api/telegram/groups/${groupId}/photo?size=${size}`;
    };

    const fetchUserGroups = async (tgUserId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3001/api/telegram/groups-by-user?tgUserId=${tgUserId}`);
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

    const handleGroupSelect = async (group: TelegramGroup) => {
        setSelectedGroup(group);
        try {
            const verificationMsg = `Please verify ownership of ${group.title} by sending this message to your group: @cryptomarketplace verify ${group.id}`;
            setVerificationMessage(verificationMsg);
            setCurrentStep('verify_ownership');
        } catch (error) {
            setStatus({
                type: 'error',
                message: t('seller.verification.error'),
            });
        }
    };

    const handleVerifyOwnership = async () => {
        setIsVerifying(true);
        try {
            // TODO: Implement API call to verify ownership
            // This is a mock success
            setCurrentStep('set_price');
        } catch (error) {
            setStatus({
                type: 'error',
                message: t('seller.verification.error'),
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        try {
            // TODO: Implement API call to list the group
            setStatus({
                type: 'success',
                message: t('seller.price.success'),
            });
            // Reset form
            setCurrentStep('telegram_login');
            setSelectedGroup(null);
            setUserGroups([]);
            setVerificationMessage('');
            setPrice('');
        } catch (error) {
            setStatus({
                type: 'error',
                message: t('seller.price.error'),
            });
        }
    };

    const copyVerificationMessage = () => {
        navigator.clipboard.writeText(verificationMessage);
        // You might want to add a toast notification here
    };

    return {
        currentStep,
        selectedGroup,
        userGroups,
        isLoading,
        error,
        verificationMessage,
        isVerifying,
        price,
        status,
        setCurrentStep,
        setPrice,
        fetchUserGroups,
        handleGroupSelect,
        handleVerifyOwnership,
        handleSubmit,
        copyVerificationMessage,
        getGroupPhotoUrl,
    };
}; 