import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { FiHome, FiUsers, FiGrid, FiBox, FiMessageCircle, FiAlertCircle, FiSettings, FiMessageSquare } from 'react-icons/fi';
import styles from '../../styles/DashboardSidebar.module.css';

export const DashboardSidebar = () => {
    const router = useRouter();
    const { t } = useTranslation('common');

    const isActive = (path: string) => router.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: FiHome, label: t('dashboard.nav.home') },
        { path: '/dashboard/store-users', icon: FiUsers, label: t('dashboard.nav.storeUsers') },
        { path: '/dashboard/categories', icon: FiGrid, label: t('dashboard.nav.categories') },
        { path: '/dashboard/products', icon: FiBox, label: t('dashboard.nav.products') },
        { path: '/dashboard/customers', icon: FiUsers, label: t('dashboard.nav.customers') },
        { path: '/dashboard/orders', icon: FiBox, label: t('dashboard.nav.orders') },
        { path: '/dashboard/telegram-groups', icon: FiMessageSquare, label: t('dashboard.nav.telegramGroups') },
        { path: '/dashboard/issues', icon: FiAlertCircle, label: t('dashboard.nav.issues') },
        { path: '/dashboard/profile', icon: FiSettings, label: t('dashboard.nav.profile') },
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