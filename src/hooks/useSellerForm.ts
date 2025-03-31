import { useState } from 'react';
import { useTranslation } from 'next-i18next';

export type Step = 'select_product' | 'search_group' | 'verify_ownership' | 'set_price';

export interface Group {
    id: string;
    name: string;
    link: string;
}

export interface Status {
    type: 'success' | 'error';
    message: string;
}

export const useSellerForm = () => {
    const { t } = useTranslation('common');
    const [currentStep, setCurrentStep] = useState<Step>('select_product');
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Group[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState<Status | null>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            // TODO: Implement API call to search groups
            // This is a mock response
            setSearchResults([
                { id: '1', name: 'Test Group 1', link: 'https://t.me/test1' },
                { id: '2', name: 'Test Group 2', link: 'https://t.me/test2' },
            ]);
        } catch (error) {
            setStatus({
                type: 'error',
                message: t('seller.search.error'),
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleGroupSelect = async (group: Group) => {
        setSelectedGroup(group);
        try {
            // TODO: Implement API call to fetch verification message
            // For now, using a static message
            const staticMessage = `Please verify ownership of ${group.name} by sending this message to your group: @cryptomarketplace verify ${group.id}`;
            setVerificationMessage(staticMessage);
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
            setCurrentStep('select_product');
            setSelectedGroup(null);
            setSearchQuery('');
            setSearchResults([]);
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
        searchQuery,
        searchResults,
        isSearching,
        verificationMessage,
        isVerifying,
        price,
        status,
        setCurrentStep,
        setSearchQuery,
        setPrice,
        handleSearch,
        handleGroupSelect,
        handleVerifyOwnership,
        handleSubmit,
        copyVerificationMessage,
    };
}; 