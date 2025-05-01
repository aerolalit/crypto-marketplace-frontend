import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { FiMail, FiUser, FiCalendar } from 'react-icons/fi';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { useUser } from '../../hooks/useUser';
import styles from '../../styles/Dashboard.module.css';

const DashboardPage = () => {
    const { t } = useTranslation('common');
    const { user, isLoading, error } = useUser();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <DashboardLayout>
            <Head>
                <title>{t('dashboard.title')} - {t('title')}</title>
                <meta name="description" content={t('dashboard.description')} />
            </Head>

            <div className={styles.container}>
                {isLoading ? (
                    <div className={styles.loading}>Loading user data...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : user ? (
                    <>
                        <div className={styles.userInfo}>
                            <h1 className={styles.greeting}>
                                {t('dashboard.greeting', {
                                    time: new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening',
                                    name: user.username || user.walletAddress.slice(0, 6) + '...' + user.walletAddress.slice(-4)
                                })}
                            </h1>
                            <p className={styles.date}>
                                {t('dashboard.stats_for_date', {
                                    date: new Date().toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })
                                })}
                            </p>
                        </div>

                        <div className={styles.userDetailsGrid}>
                            <div className={styles.detailCard}>
                                <div className={styles.detailIcon}>
                                    <FiUser />
                                </div>
                                <div className={styles.detailContent}>
                                    <h3>Wallet Address</h3>
                                    <p>{user.walletAddress}</p>
                                </div>
                            </div>
                            <div className={styles.detailCard}>
                                <div className={styles.detailIcon}>
                                    <FiMail />
                                </div>
                                <div className={styles.detailContent}>
                                    <h3>Email</h3>
                                    <p>{user.email || 'Not set'}</p>
                                    {!user.emailVerified && user.email && (
                                        <span className={styles.badge}>Not verified</span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.detailCard}>
                                <div className={styles.detailIcon}>
                                    <FiCalendar />
                                </div>
                                <div className={styles.detailContent}>
                                    <h3>Member Since</h3>
                                    <p>{formatDate(user.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <h3>{t('dashboard.stats.revenue')}</h3>
                                <p className={styles.statValue}>₹ 0</p>
                                <p className={styles.statChange}>0.00% from last Thursday</p>
                            </div>
                            <div className={styles.statCard}>
                                <h3>{t('dashboard.stats.orders')}</h3>
                                <p className={styles.statValue}>0</p>
                                <p className={styles.statChange}>0.00% from last Thursday</p>
                            </div>
                            <div className={styles.statCard}>
                                <h3>{t('dashboard.stats.average_order')}</h3>
                                <p className={styles.statValue}>₹ 0</p>
                                <p className={styles.statChange}>0.00% from last Thursday</p>
                            </div>
                        </div>

                        <div className={styles.charts}>
                            <div className={styles.chartCard}>
                                <h3>{t('dashboard.charts.hourly_orders')}</h3>
                                {/* Chart component will be added here */}
                            </div>
                            <div className={styles.chartCard}>
                                <h3>{t('dashboard.charts.weekly_sales')}</h3>
                                {/* Chart component will be added here */}
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </DashboardLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default DashboardPage; 