import React, { useState } from 'react';
import styles from '../../styles/Merchant.module.css';
import { useTranslation } from 'next-i18next';
import { API_BASE_URL } from '../../constants/config';
import { useAuth } from '../../hooks/useAuth';

interface AddSubscriptionPlanModalProps {
    onClose: () => void;
    onSuccess: () => void;
    groupId: string;
}

type PlanType = 'token-holding' | 'one-time';

interface TokenHoldingPlan {
    tokenAddress: string;
    requiredAmount: string;
}

interface OneTimePlan {
    duration: number;
    price: string;
}

export const AddSubscriptionPlanModal: React.FC<AddSubscriptionPlanModalProps> = ({
    onClose,
    onSuccess,
    groupId,
}) => {
    const { t } = useTranslation('common');
    const { token } = useAuth();
    const [selectedType, setSelectedType] = useState<PlanType>('one-time');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tokenHoldingPlan, setTokenHoldingPlan] = useState<TokenHoldingPlan>({
        tokenAddress: '',
        requiredAmount: '',
    });
    const [oneTimePlan, setOneTimePlan] = useState<OneTimePlan>({
        duration: 30,
        price: '',
    });

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            const planData = {
                groupId,
                type: selectedType,
                details: selectedType === 'token-holding' ? tokenHoldingPlan : oneTimePlan,
            };

            const response = await fetch(`${API_BASE_URL}/telegram/groups/${groupId}/subscription-plans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(planData),
            });

            if (!response.ok) {
                throw new Error(t('merchant.subscription.messages.error'));
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : t('merchant.subscription.messages.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid = () => {
        if (selectedType === 'token-holding') {
            return tokenHoldingPlan.tokenAddress.trim() !== '' && tokenHoldingPlan.requiredAmount.trim() !== '';
        } else {
            return oneTimePlan.duration > 0 && oneTimePlan.price.trim() !== '';
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>{t('merchant.subscription.addPlan')}</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        {t('common.modal.close')}
                    </button>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.planTypeSelector}>
                        <h4>{t('merchant.subscription.planType.title')}</h4>
                        <div className={styles.planTypeButtons}>
                            <button
                                className={`${styles.planTypeButton} ${selectedType === 'token-holding' ? styles.active : ''}`}
                                onClick={() => setSelectedType('token-holding')}
                            >
                                <span>{t('merchant.subscription.planDetails.tokenHolding.title')}</span>
                                <small>{t('merchant.subscription.planType.tokenHoldingDescription')}</small>
                            </button>
                            <button
                                className={`${styles.planTypeButton} ${selectedType === 'one-time' ? styles.active : ''}`}
                                onClick={() => setSelectedType('one-time')}
                            >
                                <span>{t('merchant.subscription.planDetails.oneTime.title')}</span>
                                <small>{t('merchant.subscription.planType.oneTimeDescription')}</small>
                            </button>
                        </div>
                    </div>

                    {selectedType === 'token-holding' ? (
                        <div className={styles.planForm}>
                            <div className={styles.formGroup}>
                                <label>
                                    {t('merchant.subscription.tokenAddress')}
                                    <span className={styles.required}> *</span>
                                </label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    value={tokenHoldingPlan.tokenAddress}
                                    onChange={(e) => setTokenHoldingPlan(prev => ({
                                        ...prev,
                                        tokenAddress: e.target.value
                                    }))}
                                    placeholder={t('merchant.subscription.tokenAddressPlaceholder')}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    {t('merchant.subscription.planDetails.tokenHolding.requiredTokens')}
                                    <span className={styles.required}> *</span>
                                </label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    value={tokenHoldingPlan.requiredAmount}
                                    onChange={(e) => setTokenHoldingPlan(prev => ({
                                        ...prev,
                                        requiredAmount: e.target.value
                                    }))}
                                    placeholder={t('merchant.subscription.requiredAmountPlaceholder')}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.planForm}>
                            <div className={styles.formGroup}>
                                <label>
                                    {t('merchant.subscription.planDetails.oneTime.durationLabel')}
                                    <span className={styles.required}> *</span>
                                </label>
                                <div className={styles.inputWithSuffix}>
                                    <input
                                        className={styles.input}
                                        type="number"
                                        min="1"
                                        value={oneTimePlan.duration}
                                        onChange={(e) => setOneTimePlan(prev => ({
                                            ...prev,
                                            duration: parseInt(e.target.value)
                                        }))}
                                    />
                                    <span className={styles.inputSuffix}>
                                        {t('merchant.subscription.durationSuffix')}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    {t('merchant.subscription.planDetails.oneTime.priceLabel')}
                                    <span className={styles.required}> *</span>
                                </label>
                                <div className={styles.inputWithSuffix}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        value={oneTimePlan.price}
                                        onChange={(e) => setOneTimePlan(prev => ({
                                            ...prev,
                                            price: e.target.value
                                        }))}
                                        placeholder={t('merchant.subscription.pricePlaceholder')}
                                    />
                                    <span className={styles.inputSuffix}>
                                        {t('merchant.subscription.ethSuffix')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.modalActions}>
                        <button
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            {t('merchant.subscription.actions.cancel')}
                        </button>
                        <button
                            className={styles.submitButton}
                            onClick={handleSubmit}
                            disabled={!isValid() || isSubmitting}
                        >
                            {isSubmitting ? t('common.submitting') : t('merchant.subscription.actions.add')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 