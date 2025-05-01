import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import styles from '../../styles/Dashboard.module.css';

const DashboardPage = () => {
    const { t } = useTranslation('common');

    return (
        <DashboardLayout>
            <Head>
                <title>{t('dashboard.title')} - {t('title')}</title>
                <meta name="description" content={t('dashboard.description')} />
            </Head>

            <div className={styles.container}>
                <h1 className={styles.greeting}>
                    {t('dashboard.greeting', { time: new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening' })}
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
            </div>
        </DashboardLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default DashboardPage; 