import { useTranslation } from 'next-i18next';
import styles from '../../styles/Seller.module.css';

interface PriceStepProps {
    price: string;
    onPriceChange: (price: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    status: { type: 'success' | 'error'; message: string } | null;
}

export const PriceStep = ({
    price,
    onPriceChange,
    onSubmit,
    status,
}: PriceStepProps) => {
    const { t } = useTranslation('common');

    return (
        <form onSubmit={onSubmit} className={styles.stepContent}>
            <h2>{t('seller.price.title')}</h2>
            <div className={styles.formGroup}>
                <label htmlFor="price">{t('seller.price.label')}</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => onPriceChange(e.target.value)}
                    placeholder={t('seller.price.placeholder')}
                    step="0.000000000000000001"
                    required
                />
            </div>
            {status && (
                <div className={`${styles.status} ${styles[status.type]}`}>
                    {status.message}
                </div>
            )}
            <button type="submit" className={styles.submitButton}>
                {t('seller.price.submit')}
            </button>
        </form>
    );
}; 