import { useTranslation } from 'next-i18next';
import styles from '../../styles/Seller.module.css';

interface ProductSelectionProps {
    onSelect: () => void;
}

export const ProductSelection = ({ onSelect }: ProductSelectionProps) => {
    const { t } = useTranslation('common');

    return (
        <div className={styles.stepContent}>
            <h2>{t('seller.steps.select_product')}</h2>
            <button
                className={styles.productButton}
                onClick={onSelect}
            >
                {t('seller.product_types.telegram_invite')}
            </button>
        </div>
    );
}; 