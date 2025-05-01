import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '../../constants/config';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/Settings.module.css';

interface GroupPhotoProps {
    groupId: string;
    title: string;
    size?: number;
}

export const GroupPhoto = ({ groupId, title, size = 56 }: GroupPhotoProps) => {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const { token } = useAuth();
    const fetchedRef = useRef(false);

    useEffect(() => {
        const fetchGroupPhoto = async () => {
            if (fetchedRef.current) return;
            try {
                const response = await fetch(`${API_BASE_URL}/telegram/groups/${groupId}/photo`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setPhotoUrl(url);
                    fetchedRef.current = true;
                }
            } catch (error) {
                console.error('Error fetching group photo:', error);
            }
        };

        if (groupId && token) {
            fetchGroupPhoto();
        }

        // Cleanup function to revoke object URL
        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    }, [groupId, token]);

    if (!photoUrl) {
        // Display placeholder with first letter of group title
        return (
            <div
                className={styles.groupImagePlaceholder}
                style={{
                    width: size,
                    height: size,
                    fontSize: size * 0.4 // Scale font size relative to container size
                }}
            >
                {title.charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <div className={styles.groupImage} style={{ width: size, height: size }}>
            <Image
                src={photoUrl}
                alt={title}
                width={size}
                height={size}
                className={styles.groupPhoto}
            />
        </div>
    );
}; 