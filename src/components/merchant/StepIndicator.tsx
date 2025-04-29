import { useTranslation } from 'next-i18next';
import styles from '../../styles/Merchant.module.css';
import { Step } from '../../hooks/useMerchantForm';

interface StepIndicatorProps {
    currentStep: Step;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
    const { t } = useTranslation('common');

    return (
        <div className={styles.stepIndicator}>
            <div className={`${styles.step} ${currentStep === 'telegram_login' ? styles.active : ''}`}>
                Telegram Login
            </div>
            <div className={`${styles.step} ${currentStep === 'search_group' ? styles.active : ''}`}>
                {t('merchant.steps.search_group')}
            </div>
            <div className={`${styles.step} ${currentStep === 'subscription_plan' ? styles.active : ''}`}>
                {t('merchant.steps.subscription_plan')}
            </div>
        </div>
    );
}; 