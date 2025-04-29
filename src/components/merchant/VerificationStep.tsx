import { useTranslation } from 'next-i18next';
import styles from '../../styles/Merchant.module.css';
import { TelegramGroup } from '../../hooks/useMerchantForm';

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
            <h2>{t('merchant.verification.title')}</h2>
            <p>{t('merchant.verification.message')}</p>
            <div className={styles.verificationMessage}>
                <code>{verificationMessage}</code>
                <button onClick={onCopyMessage}>
                    {t('merchant.verification.copy')}
                </button>
            </div>
            <button
                onClick={onVerify}
                disabled={isVerifying}
                className={styles.verifyButton}
            >
                {isVerifying ? t('merchant.verification.verifying') : t('merchant.verification.verify')}
            </button>
        </div>
    );
}; 