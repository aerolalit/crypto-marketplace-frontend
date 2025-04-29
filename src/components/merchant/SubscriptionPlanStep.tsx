import React, { useState } from 'react';
import styles from '../../styles/Merchant.module.css';

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

interface SubscriptionPlanStepProps {
    plans: SubscriptionPlan[];
    onAddPlan: (plan: Omit<SubscriptionPlan, 'id'>) => void;
    onRemovePlan: (planId: string) => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

export const SubscriptionPlanStep: React.FC<SubscriptionPlanStepProps> = ({
    plans,
    onAddPlan,
    onRemovePlan,
    onSubmit,
    isLoading,
}) => {
    const [selectedType, setSelectedType] = useState<PlanType>('one-time');
    const [newTokenHoldingPlan, setNewTokenHoldingPlan] = useState({
        tokenAddress: '',
        requiredAmount: '',
    });
    const [newOneTimePlan, setNewOneTimePlan] = useState({
        duration: 30,
        price: '',
    });

    const handleAddPlan = () => {
        if (selectedType === 'token-holding' && isValidTokenHoldingPlan(newTokenHoldingPlan)) {
            onAddPlan({
                type: 'token-holding',
                ...newTokenHoldingPlan,
            });
            setNewTokenHoldingPlan({ tokenAddress: '', requiredAmount: '' });
        } else if (selectedType === 'one-time' && isValidOneTimePlan(newOneTimePlan)) {
            onAddPlan({
                type: 'one-time',
                ...newOneTimePlan,
            });
            setNewOneTimePlan({ duration: 30, price: '' });
        }
    };

    return (
        <div className={styles.subscriptionPlanStep}>
            <h2>Define Subscription Plans</h2>

            <div className={styles.existingPlans}>
                {plans.map((plan) => (
                    <div key={plan.id} className={styles.planCard}>
                        {plan.type === 'token-holding' && (
                            <>
                                <h3>Token Holding Plan</h3>
                                <p>Token: {plan.tokenAddress}</p>
                                <p>Required Amount: {plan.requiredAmount}</p>
                            </>
                        )}
                        {plan.type === 'one-time' && (
                            <>
                                <h3>One-time Payment Plan</h3>
                                <p>Duration: {plan.duration} days</p>
                                <p>Price: {plan.price} ETH</p>
                            </>
                        )}
                        <button
                            className={styles.removeButton}
                            onClick={() => onRemovePlan(plan.id || '')}
                        >
                            Remove Plan
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.addNewPlan}>
                <h3>Add New Plan</h3>
                <div className={styles.planTypeSelector}>
                    <button
                        className={`${styles.planTypeButton} ${selectedType === 'token-holding' ? styles.active : ''}`}
                        onClick={() => setSelectedType('token-holding')}
                    >
                        Token Holding
                    </button>
                    <button
                        className={`${styles.planTypeButton} ${selectedType === 'one-time' ? styles.active : ''}`}
                        onClick={() => setSelectedType('one-time')}
                    >
                        One-time Payment
                    </button>
                </div>

                <div className={styles.planConfig}>
                    {selectedType === 'token-holding' && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Token Contract Address</label>
                                <input
                                    type="text"
                                    value={newTokenHoldingPlan.tokenAddress}
                                    onChange={(e) => setNewTokenHoldingPlan({
                                        ...newTokenHoldingPlan,
                                        tokenAddress: e.target.value,
                                    })}
                                    placeholder="0x..."
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Required Token Amount</label>
                                <input
                                    type="text"
                                    value={newTokenHoldingPlan.requiredAmount}
                                    onChange={(e) => setNewTokenHoldingPlan({
                                        ...newTokenHoldingPlan,
                                        requiredAmount: e.target.value,
                                    })}
                                    placeholder="Enter amount"
                                />
                            </div>
                        </>
                    )}

                    {selectedType === 'one-time' && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Access Duration (days)</label>
                                <input
                                    type="number"
                                    value={newOneTimePlan.duration}
                                    onChange={(e) => setNewOneTimePlan({
                                        ...newOneTimePlan,
                                        duration: parseInt(e.target.value),
                                    })}
                                    min="1"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Price (ETH)</label>
                                <input
                                    type="text"
                                    value={newOneTimePlan.price}
                                    onChange={(e) => setNewOneTimePlan({
                                        ...newOneTimePlan,
                                        price: e.target.value,
                                    })}
                                    placeholder="0.1"
                                />
                            </div>
                        </>
                    )}
                </div>

                <button
                    className={styles.addPlanButton}
                    onClick={handleAddPlan}
                    disabled={
                        (selectedType === 'token-holding' && !isValidTokenHoldingPlan(newTokenHoldingPlan)) ||
                        (selectedType === 'one-time' && !isValidOneTimePlan(newOneTimePlan))
                    }
                >
                    Add Plan
                </button>
            </div>

            <button
                className={styles.submitButton}
                onClick={onSubmit}
                disabled={plans.length === 0 || isLoading}
            >
                {isLoading ? 'Creating...' : 'Create Listing'}
            </button>
        </div>
    );
};

function isValidTokenHoldingPlan(plan: { tokenAddress: string; requiredAmount: string }): boolean {
    return Boolean(
        plan.tokenAddress &&
        plan.tokenAddress.startsWith('0x') &&
        plan.requiredAmount &&
        parseFloat(plan.requiredAmount) > 0
    );
}

function isValidOneTimePlan(plan: { duration: number; price: string }): boolean {
    return Boolean(
        plan.duration &&
        plan.duration > 0 &&
        plan.price &&
        parseFloat(plan.price) > 0
    );
} 