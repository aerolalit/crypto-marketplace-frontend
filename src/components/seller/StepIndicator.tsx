import { useTranslation } from 'next-i18next';
import styles from '../../styles/Seller.module.css';
import { Step } from '../../hooks/useSellerForm';

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
                {t('seller.steps.search_group')}
            </div>
            <div className={`${styles.step} ${currentStep === 'verify_ownership' ? styles.active : ''}`}>
                {t('seller.steps.verify_ownership')}
            </div>
            <div className={`${styles.step} ${currentStep === 'set_price' ? styles.active : ''}`}>
                {t('seller.steps.set_price')}
            </div>
        </div>
    );
}; 