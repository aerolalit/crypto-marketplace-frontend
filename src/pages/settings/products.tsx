import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SettingsLayout } from '../../components/layouts/SettingsLayout';
import styles from '../../styles/Settings.module.css';

const ProductsPage = () => {
    const { t } = useTranslation('common');

    return (
        <SettingsLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>{t('settings.nav.products')}</h1>
                <p className={styles.description}>
                    {t('settings.products.description')}
                </p>
                {/* Products list and management will be implemented here */}
            </div>
        </SettingsLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default ProductsPage; 