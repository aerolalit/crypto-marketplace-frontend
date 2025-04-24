import type { NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useAccount } from 'wagmi';
import { ConnectButton } from '../components/ConnectButton';
import { StepIndicator } from '../components/seller/StepIndicator';
import { ProductSelection } from '../components/seller/ProductSelection';
import { GroupSearch } from '../components/seller/GroupSearch';
import { VerificationStep } from '../components/seller/VerificationStep';
import { PriceStep } from '../components/seller/PriceStep';
import { useSellerForm } from '../hooks/useSellerForm';
import styles from '../styles/Seller.module.css';

const Seller: NextPage = () => {
    const { t } = useTranslation('common');
    const { isConnected } = useAccount();
    const {
        currentStep,
        selectedGroup,
        searchQuery,
        searchResults,
        isSearching,
        verificationMessage,
        isVerifying,
        price,
        status,
        setCurrentStep,
        setSearchQuery,
        setPrice,
        handleSearch,
        handleGroupSelect,
        handleVerifyOwnership,
        handleSubmit,
        copyVerificationMessage,
    } = useSellerForm();

    const pageTitle = `${t('seller.title')} - ${t('title')}`;

    return (
        <div className={styles.container}>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={t('description')} />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <main className={styles.main}>
                <h1 className={styles.title}>{t('seller.title')}</h1>

                {!isConnected ? (
                    <div className={styles.connectPrompt}>
                        <p>Please connect your wallet to list your Telegram group</p>
                        <ConnectButton />
                    </div>
                ) : (
                    <div className={styles.steps}>
                        <StepIndicator currentStep={currentStep} />

                        {currentStep === 'select_product' && (
                            <ProductSelection onSelect={() => setCurrentStep('search_group')} />
                        )}

                        {currentStep === 'search_group' && (
                            <GroupSearch
                                searchQuery={searchQuery}
                                onSearchQueryChange={setSearchQuery}
                                onSearch={handleSearch}
                                isSearching={isSearching}
                                searchResults={searchResults}
                                onGroupSelect={handleGroupSelect}
                            />
                        )}

                        {currentStep === 'verify_ownership' && selectedGroup && (
                            <VerificationStep
                                group={selectedGroup}
                                verificationMessage={verificationMessage}
                                isVerifying={isVerifying}
                                onCopyMessage={copyVerificationMessage}
                                onVerify={handleVerifyOwnership}
                            />
                        )}

                        {currentStep === 'set_price' && (
                            <PriceStep
                                price={price}
                                onPriceChange={setPrice}
                                onSubmit={handleSubmit}
                                status={status}
                            />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default Seller; 