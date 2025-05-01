import React from 'react';
import styles from '../../styles/Merchant.module.css';
import TelegramLoginButton from '../TelegramLoginButton';
import { useTranslation } from 'next-i18next';

interface AddGroupModalProps {
    onClose: () => void;
    onLoginSuccess: () => void;
    botUsername: string;
    botLink: string;
}

export const AddGroupModal: React.FC<AddGroupModalProps> = ({
    onClose,
    onLoginSuccess,
    botUsername,
    botLink,
}) => {
    const { t } = useTranslation('common');

    const handleBotLink = () => {
        window.open(botLink, '_blank');
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>{t('dashboard.sections.telegramGroups.addGroup')}</h3>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalContent}>
                    <p>{t('merchant.search.instructions')}</p>
                    <ol className={styles.instructionsList}>
                        <li>
                            <div className={styles.instructionNumber}>1</div>
                            <div className={styles.instructionText}>
                                {t('merchant.search.add_bot')}
                                <div className={styles.botInfo}>
                                    <span className={styles.botName}>{botUsername}</span>
                                    <button onClick={handleBotLink} className={styles.botLink}>
                                        Open Bot in Telegram
                                    </button>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={styles.instructionNumber}>2</div>
                            <div className={styles.instructionText}>
                                {t('merchant.search.make_admin')}
                                <ul>
                                    <li>{t('merchant.permissions.ban_users')}</li>
                                    <li>{t('merchant.permissions.invite_users')}</li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div className={styles.instructionNumber}>3</div>
                            <div className={styles.instructionText}>
                                {t('merchant.steps.verify_ownership')}
                                <div className={styles.telegramAuth}>
                                    <TelegramLoginButton onLoginSuccess={onLoginSuccess} />
                                </div>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}; 