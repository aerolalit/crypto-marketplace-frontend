import Image from 'next/image';
import { FiUser } from 'react-icons/fi';
import styles from '../../styles/Settings.module.css';

interface UserAvatarProps {
    user: {
        photoUrl?: string;
        username?: string;
        firstName?: string;
    };
    size?: number;
}

export const UserAvatar = ({ user, size = 32 }: UserAvatarProps) => {
    const displayName = user.username || user.firstName || 'User';

    if (!user.photoUrl) {
        return (
            <div
                className={styles.userAvatarPlaceholder}
                style={{
                    width: size,
                    height: size,
                    fontSize: `${size * 0.4}px`
                }}
            >
                <FiUser />
            </div>
        );
    }

    return (
        <div className={styles.userAvatar} style={{ width: size, height: size }}>
            <Image
                src={user.photoUrl}
                alt={displayName}
                width={size}
                height={size}
                className={styles.userAvatarImage}
            />
        </div>
    );
}; 