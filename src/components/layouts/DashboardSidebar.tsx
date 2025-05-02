import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { FiHome, FiUser, FiMessageCircle } from 'react-icons/fi';
import styles from '../../styles/DashboardSidebar.module.css';

export const DashboardSidebar = () => {
    const router = useRouter();
    const { t } = useTranslation('common');

    const isActive = (path: string) => router.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: FiHome, label: t('dashboard.nav.home') },
        { path: '/dashboard/telegram-groups', icon: FiMessageCircle, label: t('dashboard.nav.telegramGroups') },
        { path: '/dashboard/profile', icon: FiUser, label: t('dashboard.nav.profile') },
    ];

    return (
        <nav className={styles.sidebar}>
            <div className={styles.sidebarContent}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                    >
                        <span className={styles.icon}>
                            <item.icon />
                        </span>
                        <span className={styles.label}>{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}; 