import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiPlus, FiAlertCircle, FiEdit2, FiMessageCircle, FiUserX, FiInfo, FiPlusCircle, FiRefreshCw, FiClock, FiDollarSign } from 'react-icons/fi';
import { DashboardLayout } from '../../../components/layouts/DashboardLayout';
import { GroupPhoto } from '../../../components/telegram/GroupPhoto';
import { UserAvatar } from '../../../components/telegram/UserAvatar';
import { useTelegramGroups } from '../../../hooks/useTelegramGroups';
import styles from '../../../styles/Settings.module.css';
import Image from 'next/image';
import { format } from 'date-fns';
import { API_BASE_URL } from '../../../constants/config';
import TelegramLoginButton from '../../../components/TelegramLoginButton';
import { AddGroupModal } from '../../../components/telegram/AddGroupModal';
import { AddSubscriptionPlanModal } from '../../../components/telegram/AddSubscriptionPlanModal';
import { useState } from 'react';

const BOT_USERNAME = '@Invite_manager1_bot';
const BOT_LINK = 'https://t.me/Invite_manager1_bot';

const TelegramGroupsPage = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { groups, loading, error, fetchGroups } = useTelegramGroups();
    const [showAddModal, setShowAddModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    const handleBotLink = () => {
        window.open(BOT_LINK, '_blank');
    };

    const handleTelegramSuccess = () => {
        fetchGroups();
        setShowAddModal(false);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchGroups();
        setIsRefreshing(false);
    };

    const handleAddSubscriptionPlan = (groupId: string) => {
        setSelectedGroupId(groupId);
        setShowSubscriptionModal(true);
    };

    const handleSubscriptionPlanSuccess = () => {
        fetchGroups();
        setShowSubscriptionModal(false);
        setSelectedGroupId(null);
    };

    const renderSubscriptionPlans = (plans: any[], groupId: string) => {
        if (!plans || plans.length === 0) {
            return (
                <div className={styles.noPlans}>
                    <span>{t('dashboard.sections.telegramGroups.table.subscriptionPlansInfo.noPlans')}</span>
                    <button
                        onClick={() => handleAddSubscriptionPlan(groupId)}
                        className={`${styles.button} ${styles.addPlanButton}`}
                    >
                        <FiPlus className={styles.buttonIcon} />
                        {t('merchant.subscription.addPlanButton')}
                    </button>
                </div>
            );
        }

        return (
            <div className={styles.plansList}>
                {plans.map((plan) => (
                    <div key={plan.id} className={styles.planItem}>
                        {plan.type === 'token-holding' ? (
                            <>
                                <FiDollarSign className={styles.planIcon} />
                                <div className={styles.planDetails}>
                                    <span className={styles.planType}>
                                        {t('dashboard.sections.telegramGroups.table.subscriptionPlansInfo.tokenHolding')}
                                    </span>
                                    <span className={styles.planInfo}>
                                        {t('dashboard.sections.telegramGroups.table.subscriptionPlansInfo.requiredTokens', {
                                            amount: plan.details.requiredAmount
                                        })}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <FiClock className={styles.planIcon} />
                                <div className={styles.planDetails}>
                                    <span className={styles.planType}>
                                        {t('dashboard.sections.telegramGroups.table.subscriptionPlansInfo.oneTime')}
                                    </span>
                                    <span className={styles.planInfo}>
                                        {t('dashboard.sections.telegramGroups.table.subscriptionPlansInfo.duration', {
                                            duration: plan.details.duration
                                        })} - {t('dashboard.sections.telegramGroups.table.subscriptionPlansInfo.price', {
                                            price: plan.details.price
                                        })}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                <button
                    onClick={() => handleAddSubscriptionPlan(groupId)}
                    className={`${styles.button} ${styles.addPlanButton}`}
                >
                    <FiPlus className={styles.buttonIcon} />
                    {t('merchant.subscription.addPlanButton')}
                </button>
            </div>
        );
    };

    const renderBotPermissions = (permissions: string[]) => {
        const permissionLabels: { [key: string]: { label: string; icon: JSX.Element } } = {
            can_manage_chat: { label: 'Manage Chat', icon: <FiMessageCircle className={styles.actionIcon} /> },
            can_restrict_members: { label: 'Restrict Members', icon: <FiUserX className={styles.actionIcon} /> },
            can_change_info: { label: 'Change Info', icon: <FiInfo className={styles.actionIcon} /> },
            can_invite_users: { label: 'Invite Users', icon: <FiPlusCircle className={styles.actionIcon} /> },
            can_pin_messages: { label: 'Pin Messages', icon: <FiMessageCircle className={styles.actionIcon} /> },
        };

        return permissions.map((permission) => {
            const { label, icon } = permissionLabels[permission] || {
                label: permission.replace('can_', '').replace('_', ' '),
                icon: <FiMessageCircle className={styles.actionIcon} />
            };
            return (
                <button key={permission} className={styles.actionButton}>
                    {icon}
                    {label}
                </button>
            );
        });
    };

    return (
        <DashboardLayout>
            <Head>
                <title>{t('dashboard.sections.telegramGroups.title')} - {t('title')}</title>
                <meta name="description" content={t('dashboard.sections.telegramGroups.description')} />
            </Head>

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>
                            {t('dashboard.sections.telegramGroups.title')}
                        </h1>
                        <p className={styles.description}>
                            {t('dashboard.sections.telegramGroups.description')}
                        </p>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            onClick={handleRefresh}
                            className={`${styles.button} ${styles.refreshButton} ${isRefreshing ? styles.spinning : ''}`}
                            disabled={isRefreshing}
                            title={t('dashboard.sections.telegramGroups.refresh')}
                        >
                            <FiRefreshCw className={styles.buttonIcon} />
                        </button>
                        {groups.length > 0 && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className={styles.button}
                            >
                                <FiPlus className={styles.buttonIcon} />
                                {t('dashboard.sections.telegramGroups.addGroup')}
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.section}>
                    {loading ? (
                        <div className={styles.loading}>
                            {t('common.loading')}
                        </div>
                    ) : error ? (
                        <div className={styles.error}>
                            <FiAlertCircle className={styles.errorIcon} />
                            {error}
                        </div>
                    ) : groups.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyContent}>
                                <h2>{t('dashboard.sections.telegramGroups.noGroups')}</h2>
                                <p>{t('merchant.search.instructions')}</p>
                                <ul className={styles.instructions}>
                                    <li>
                                        {t('merchant.search.add_bot')}
                                        <div className={styles.botInfo}>
                                            <span className={styles.botName}>{BOT_USERNAME}</span>
                                            <button onClick={handleBotLink} className={styles.botLink}>
                                                {t('dashboard.sections.telegramGroups.openInTelegram')}
                                            </button>
                                        </div>
                                    </li>
                                    <li>
                                        {t('merchant.search.make_admin')}
                                        <ul>
                                            <li>{t('merchant.permissions.ban_users')}</li>
                                            <li>{t('merchant.permissions.invite_users')}</li>
                                        </ul>
                                    </li>
                                </ul>
                                <div className={styles.telegramAuth}>
                                    <h3>{t('merchant.steps.verify_ownership')}</h3>
                                    <TelegramLoginButton onLoginSuccess={handleTelegramSuccess} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>{t('dashboard.sections.telegramGroups.table.name')}</th>
                                        <th>{t('dashboard.sections.telegramGroups.table.members')}</th>
                                        <th>{t('dashboard.sections.telegramGroups.table.addedBy')}</th>
                                        <th>{t('dashboard.sections.telegramGroups.table.permissions')}</th>
                                        <th>{t('dashboard.sections.telegramGroups.table.subscriptionPlans')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map((group) => (
                                        <tr key={group.id}>
                                            <td className={styles.groupInfo}>
                                                <GroupPhoto
                                                    groupId={group.id}
                                                    title={group.title}
                                                    size={56}
                                                />
                                                <div className={styles.groupDetails}>
                                                    <div className={styles.groupTitle}>{group.title}</div>
                                                    <div className={styles.groupId}>ID: {group.id}</div>
                                                </div>
                                            </td>
                                            <td className={styles.memberCount}>
                                                {group.memberCount}
                                            </td>
                                            <td className={styles.addedBy}>
                                                {group.addedBy && (
                                                    <div className={styles.userInfo}>
                                                        <div className={styles.userHeader}>
                                                            <UserAvatar user={group.addedBy} size={24} />
                                                            <span className={styles.username}>{group.addedBy.username || group.addedBy.firstName}</span>
                                                        </div>
                                                        <span className={styles.addedDate}>
                                                            {format(new Date(group.createdAt), 'MMM d, yyyy')}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <div className={styles.permissions}>
                                                    {renderBotPermissions(group.botPermissions)}
                                                </div>
                                            </td>
                                            <td>
                                                {renderSubscriptionPlans(group.subscriptionPlans, group.id)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showAddModal && (
                <AddGroupModal
                    onClose={() => setShowAddModal(false)}
                    onLoginSuccess={handleTelegramSuccess}
                    botUsername={BOT_USERNAME}
                    botLink={BOT_LINK}
                />
            )}

            {showSubscriptionModal && selectedGroupId && (
                <AddSubscriptionPlanModal
                    onClose={() => {
                        setShowSubscriptionModal(false);
                        setSelectedGroupId(null);
                    }}
                    onSuccess={handleSubscriptionPlanSuccess}
                    groupId={selectedGroupId}
                />
            )}
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