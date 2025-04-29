import type { NextPage } from 'next';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useAccount } from 'wagmi';
import { ConnectButton } from '../components/ConnectButton';
import { StepIndicator } from '../components/merchant/StepIndicator';
import { SubscriptionPlanStep } from '../components/merchant/SubscriptionPlanStep';
import TelegramLoginButton from '../components/TelegramLoginButton';
import { PermissionModal } from '../components/merchant/PermissionModal';
import { useMerchantForm } from '../hooks/useMerchantForm';
import styles from '../styles/Merchant.module.css';
import { FiRefreshCw } from 'react-icons/fi';

const Merchant: NextPage = () => {
    const { t } = useTranslation('common');
    const { isConnected } = useAccount();
    const {
        currentStep,
        selectedGroup,
        userGroups,
        isLoading,
        error,
        status,
        telegramUserId,
        showPermissionModal,
        groupWithMissingPermissions,
        plans,
        REQUIRED_PERMISSIONS,
        setCurrentStep,
        setShowPermissionModal,
        fetchUserGroups,
        handleGroupSelect,
        handleSubmit,
        addPlan,
        removePlan,
    } = useMerchantForm();

    const pageTitle = `${t('merchant.title')} - ${t('title')}`;

    const NoGroupsFound = () => (
        <div className={styles.noGroups}>
            <h3>{t('merchant.search.no_results')}</h3>
            <p>{t('merchant.search.instructions')}</p>
            <div className={styles.instructionsList}>
                <li>
                    <span className={styles.instructionNumber}>1</span>
                    <div className={styles.instructionText}>
                        {t('merchant.search.add_bot')}
                        <a
                            href="https://t.me/Invite_manager1_bot"
                            className={styles.botLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @Invite_manager1_bot
                        </a>
                    </div>
                </li>
                <li>
                    <span className={styles.instructionNumber}>2</span>
                    <div className={styles.instructionText}>
                        {t('merchant.search.make_admin')}
                        <ul className={styles.permissionsList}>
                            <li>{t('merchant.permissions.delete_messages')}</li>
                            <li>{t('merchant.permissions.ban_users')}</li>
                            <li>{t('merchant.permissions.invite_users')}</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <span className={styles.instructionNumber}>3</span>
                    <div className={styles.instructionText}>
                        {t('merchant.search.try_again')}
                    </div>
                </li>
            </div>
            <button
                className={styles.refreshButton}
                onClick={() => telegramUserId && fetchUserGroups(telegramUserId)}
                disabled={!telegramUserId || isLoading}
            >
                {isLoading ? (
                    <span className={styles.buttonContent}>
                        <FiRefreshCw className={styles.spinning} />
                        {t('merchant.search.refreshing')}
                    </span>
                ) : (
                    <span className={styles.buttonContent}>
                        <FiRefreshCw />
                        {t('merchant.search.refresh')}
                    </span>
                )}
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
                <h1 className={styles.title}>{t('merchant.title')}</h1>

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
                                <h2>{t('merchant.steps.search_group')}</h2>
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

                        {currentStep === 'subscription_plan' && (
                            <SubscriptionPlanStep
                                plans={plans || []}
                                onAddPlan={addPlan}
                                onRemovePlan={removePlan}
                                onSubmit={handleSubmit}
                                isLoading={isLoading}
                            />
                        )}

                        {status && (
                            <div className={`${styles.status} ${styles[status.type]}`}>
                                {status.message}
                            </div>
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

export default Merchant; 