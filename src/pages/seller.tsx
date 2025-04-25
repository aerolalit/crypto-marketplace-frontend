import type { NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useAccount } from 'wagmi';
import { ConnectButton } from '../components/ConnectButton';
import { StepIndicator } from '../components/seller/StepIndicator';
import { PriceStep } from '../components/seller/PriceStep';
import TelegramLoginButton from '../components/TelegramLoginButton';
import { useSellerForm } from '../hooks/useSellerForm';
import { PermissionModal } from '../components/seller/PermissionModal';
import styles from '../styles/Seller.module.css';

const Seller: NextPage = () => {
    const { t } = useTranslation('common');
    const { isConnected } = useAccount();
    const {
        currentStep,
        selectedGroup,
        userGroups,
        isLoading,
        error,
        price,
        status,
        telegramUserId,
        showPermissionModal,
        groupWithMissingPermissions,
        REQUIRED_PERMISSIONS,
        setCurrentStep,
        setPrice,
        fetchUserGroups,
        handleGroupSelect,
        handleSubmit,
        setShowPermissionModal,
    } = useSellerForm();

    const pageTitle = `${t('seller.title')} - ${t('title')}`;

    const NoGroupsFound = () => (
        <div className={styles.noGroups}>
            <h3>No Groups Found</h3>
            <p>Follow these steps to add your Telegram group:</p>
            <ol>
                <li>Add our bot <a
                    href="https://t.me/Invite_manager1_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.botLink}
                >@Invite_manager1_bot</a> to your group</li>
                <li>Make the bot an administrator</li>
                <li>Grant the following permissions:
                    <ul>
                        <li>Delete messages</li>
                        <li>Ban users</li>
                        <li>Invite users via link</li>
                    </ul>
                </li>
            </ol>
            <button
                className={styles.refreshButton}
                onClick={() => telegramUserId && fetchUserGroups(telegramUserId)}
                disabled={!telegramUserId}
            >
                Refresh Groups
            </button>
        </div>
    );

    return (
        <div className={styles.container}>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={t('description')} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>{t('seller.title')}</h1>

                {showPermissionModal && groupWithMissingPermissions && (
                    <PermissionModal
                        group={groupWithMissingPermissions}
                        missingPermissions={REQUIRED_PERMISSIONS.filter(
                            permission => !groupWithMissingPermissions.botPermissions.includes(permission)
                        )}
                        onClose={() => {
                            setShowPermissionModal(false);
                            if (telegramUserId) {
                                fetchUserGroups(telegramUserId);
                            }
                        }}
                    />
                )}

                {!isConnected ? (
                    <div className={styles.connectPrompt}>
                        <p>Please connect your wallet to list your Telegram group</p>
                        <ConnectButton />
                    </div>
                ) : (
                    <div className={styles.steps}>
                        <StepIndicator currentStep={currentStep} />

                        {currentStep === 'telegram_login' && (
                            <div className={styles.stepContent}>
                                <h2>Connect with Telegram</h2>
                                <TelegramLoginButton
                                    onLoginSuccess={(user) => {
                                        fetchUserGroups(user.id);
                                    }}
                                />
                            </div>
                        )}

                        {currentStep === 'search_group' && (
                            <div className={styles.stepContent}>
                                <h2>{t('seller.steps.search_group')}</h2>
                                {isLoading ? (
                                    <div className={styles.loading}>Loading your groups...</div>
                                ) : error ? (
                                    <div className={styles.error}>{error}</div>
                                ) : (
                                    <div className={styles.groupList}>
                                        {userGroups.length === 0 ? (
                                            <NoGroupsFound />
                                        ) : (
                                            userGroups.map((group) => (
                                                <button
                                                    key={group.id}
                                                    className={styles.groupCard}
                                                    onClick={() => handleGroupSelect(group)}
                                                >
                                                    <div className={styles.groupCardContent}>
                                                        <div className={styles.groupPhoto}>
                                                            <img
                                                                src={group.photoUrl}
                                                                alt={group.title}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '/default-group.png';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className={styles.groupInfo}>
                                                            <h3>{group.title}</h3>
                                                            <p>Members: {group.memberCount}</p>
                                                            {group.isVerified && (
                                                                <span className={styles.verifiedBadge}>Verified</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
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