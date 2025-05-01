import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { DashboardLayout } from '../../../components/layouts/DashboardLayout';
import styles from '../../../styles/Settings.module.css';

const TelegramGroupsPage = () => {
    const { t } = useTranslation('common');

    return (
        <DashboardLayout>
            <Head>
                <title>{t('dashboard.sections.telegramGroups.title')} - {t('title')}</title>
                <meta name="description" content={t('dashboard.sections.telegramGroups.description')} />
            </Head>

            <div className={styles.container}>
                <h1 className={styles.title}>
                    {t('dashboard.sections.telegramGroups.title')}
                </h1>
                <p className={styles.description}>
                    {t('dashboard.sections.telegramGroups.description')}
                </p>

                {/* Telegram Groups content will be implemented here */}
                <div className={styles.section}>
                    <div className={styles.grid}>
                        {/* Add your Telegram Groups components here */}
                    </div>
                </div>
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

export default TelegramGroupsPage; 