import { useTranslation } from 'next-i18next';
import styles from '../../styles/Seller.module.css';
import { TelegramGroup } from '../../hooks/useSellerForm';

interface VerificationStepProps {
    group: TelegramGroup;
    verificationMessage: string;
    isVerifying: boolean;
    onCopyMessage: () => void;
    onVerify: () => void;
}

export const VerificationStep = ({
    group,
    verificationMessage,
    isVerifying,
    onCopyMessage,
    onVerify,
}: VerificationStepProps) => {
    const { t } = useTranslation('common');

    return (
        <div className={styles.stepContent}>
            <h2>{t('seller.verification.title')}</h2>
            <p>{t('seller.verification.message')}</p>
            <div className={styles.verificationMessage}>
                <code>{verificationMessage}</code>
                <button onClick={onCopyMessage}>
                    {t('seller.verification.copy')}
                </button>
            </div>
            <button
                onClick={onVerify}
                disabled={isVerifying}
                className={styles.verifyButton}
            >
                {isVerifying ? t('seller.verification.verifying') : t('seller.verification.verify')}
            </button>
        </div>
    );
}; 