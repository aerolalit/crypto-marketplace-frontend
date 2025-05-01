import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiPlus, FiAlertCircle, FiEdit2, FiMessageCircle, FiUserX, FiInfo, FiPlusCircle, FiRefreshCw, FiClock, FiDollarSign } from 'react-icons/fi';
import { DashboardLayout } from '../../../components/layouts/DashboardLayout';
import { GroupPhoto } from '../../../components/telegram/GroupPhoto';
import { useTelegramGroups } from '../../../hooks/useTelegramGroups';
import styles from '../../../styles/Settings.module.css';
import Image from 'next/image';
import { format } from 'date-fns';
import { API_BASE_URL } from '../../../constants/config';
import TelegramLoginButton from '../../../components/TelegramLoginButton';
import { AddGroupModal } from '../../../components/telegram/AddGroupModal';
import { useState } from 'react';

const BOT_USERNAME = '@Invite_manager1_bot';
const BOT_LINK = 'https://t.me/Invite_manager1_bot';

const TelegramGroupsPage = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { groups, loading, error, fetchGroups } = useTelegramGroups();
    const [showAddModal, setShowAddModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    const renderSubscriptionPlans = (plans: any[]) => {
        if (!plans || plans.length === 0) {
            return <div className={styles.noPlans}>No subscription plans</div>;
        }

        return (
            <div className={styles.plansList}>
                {plans.map((plan) => (
                    <div key={plan.id} className={styles.planItem}>
                        {plan.type === 'token-holding' ? (
                            <>
                                <FiDollarSign className={styles.planIcon} />
                                <div className={styles.planDetails}>
                                    <span className={styles.planType}>Token Holding</span>
                                    <span className={styles.planInfo}>
                                        {plan.details.requiredAmount} tokens
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <FiClock className={styles.planIcon} />
                                <div className={styles.planDetails}>
                                    <span className={styles.planType}>One-time Payment</span>
                                    <span className={styles.planInfo}>
                                        {plan.details.duration} days - {plan.details.price} ETH
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ))}
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
                            title={t('common.refresh')}
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
                            {t('profile.loading')}
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
                                                Open Bot in Telegram
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
                                        <th>Group</th>
                                        <th>Type</th>
                                        <th>Members</th>
                                        <th>Added By</th>
                                        <th>Created At</th>
                                        <th>Bot Permissions</th>
                                        <th>Subscription Plans</th>
                                        <th>Actions</th>
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
                                            <td>{group.type}</td>
                                            <td>{group.memberCount}</td>
                                            <td className={styles.addedBy}>
                                                <Image
                                                    src={group.addedBy.photoUrl}
                                                    alt={group.addedBy.firstName}
                                                    width={24}
                                                    height={24}
                                                    className={styles.userAvatar}
                                                />
                                                <span className={styles.userName}>{group.addedBy.firstName}</span>
                                            </td>
                                            <td>{format(new Date(group.createdAt), 'MMM d, yyyy HH:mm')}</td>
                                            <td>
                                                <div className={styles.permissions}>
                                                    {renderBotPermissions(group.botPermissions)}
                                                </div>
                                            </td>
                                            <td>
                                                {renderSubscriptionPlans(group.subscriptionPlans)}
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button
                                                        onClick={() => router.push(`/merchant?groupId=${group.id}`)}
                                                        className={styles.actionButton}
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 className={styles.actionIcon} />
                                                        Edit
                                                    </button>
                                                </div>
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