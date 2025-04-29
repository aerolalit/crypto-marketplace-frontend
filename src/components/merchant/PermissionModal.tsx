import React from 'react';
import styles from '../../styles/Merchant.module.css';
import { TelegramGroup } from '../../hooks/useMerchantForm';

interface PermissionModalProps {
    group: TelegramGroup;
    missingPermissions: string[];
    onClose: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
    group,
    missingPermissions,
    onClose,
}) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Missing Bot Permissions</h3>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalContent}>
                    <p>The bot in <strong>{group.title}</strong> is missing the following required permissions:</p>
                    <ul className={styles.permissionsList}>
                        {missingPermissions.map((permission) => (
                            <li key={permission}>{permission}</li>
                        ))}
                    </ul>
                    <p>Please follow these steps to grant the required permissions:</p>
                    <ol className={styles.instructionsList}>
                        <li>Open your Telegram group</li>
                        <li>Click on the group name at the top</li>
                        <li>Select "Administrators"</li>
                        <li>Find "@Invite_manager1_bot" in the list</li>
                        <li>Enable the missing permissions listed above</li>
                        <li>Click "Save" to apply the changes</li>
                    </ol>
                    <div className={styles.modalActions}>
                        <button className={styles.refreshButton} onClick={onClose}>
                            Close and Refresh Groups
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 