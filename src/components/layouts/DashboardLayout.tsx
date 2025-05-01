import { ReactNode } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import styles from '../../styles/DashboardLayout.module.css';

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className={styles.layout}>
            <DashboardSidebar />
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}; 