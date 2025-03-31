import { useTranslation } from 'next-i18next';
import styles from '../../styles/Seller.module.css';

type Step = 'select_product' | 'search_group' | 'verify_ownership' | 'set_price';

interface StepIndicatorProps {
    currentStep: Step;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
    const { t } = useTranslation('common');

    return (
        <div className={styles.stepIndicator}>
            <div className={`${styles.step} ${currentStep === 'select_product' ? styles.active : ''}`}>
                {t('seller.steps.select_product')}
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