import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { SocialMediaType, SocialMediaLinkDto, UpdateUserProfileDto } from '../../types/profile';
import styles from '../../styles/ProfileEditor.module.css';

const ensureHttps = (url: string): string => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url.replace(/^\/+/, '')}`;
};

const stripHttps = (url: string): string => {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
};

const ProfileEditor = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const { isConnected, userId } = useAuth();
    const { profile, isLoading, error, fetchProfile, updateProfile } = useProfile();

    const [bio, setBio] = useState('');
    const [links, setLinks] = useState<SocialMediaLinkDto[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        if (userId && isConnected) {
            fetchProfile(userId);
        }
    }, [userId, isConnected, fetchProfile]);

    useEffect(() => {
        if (profile) {
            setBio(profile.bio || '');
            setLinks((profile.links || []).map(link => ({
                ...link,
                url: stripHttps(link.url)
            })));
        }
    }, [profile]);

    const addLink = () => {
        setLinks([...links, { name: SocialMediaType.TWITTER, url: '' }]);
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const updateLink = (index: number, field: keyof SocialMediaLinkDto, value: string) => {
        const updatedLinks = [...(links || [])];
        updatedLinks[index] = {
            ...updatedLinks[index],
            [field]: field === 'name' ? value as SocialMediaType : value
        };
        setLinks(updatedLinks);
    };

    const validateLinks = (links: SocialMediaLinkDto[]): boolean => {
        return links.every(link => {
            const url = ensureHttps(link.url);
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setIsSaving(true);
        setSaveError(null);

        try {
            // Process and validate links
            const processedLinks = links.map(link => ({
                name: link.name,
                url: ensureHttps(link.url)
            }));

            // Validate URLs
            if (!validateLinks(processedLinks)) {
                throw new Error(t('profile.error.invalidUrl'));
            }

            // Prepare request body according to DTO
            const updateData: UpdateUserProfileDto = {
                bio: bio || undefined,
                links: processedLinks.length > 0 ? processedLinks : undefined
            };

            await updateProfile(userId, updateData);
            router.push(`/profile/${userId}`);
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isConnected) {
        return (
            <div className={styles.container}>
                <p>{t('profile.error.notConnected')}</p>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className={styles.container}>
                <p>{t('profile.error.noUserId')}</p>
            </div>
        );
    }

    const currentLinks = links || [];

    return (
        <div className={styles.container}>
            <Head>
                <title>{t('profile.edit.title')} - {t('title')}</title>
                <meta name="description" content={t('profile.edit.description')} />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>{t('profile.edit.heading')}</h1>

                {isLoading ? (
                    <div className={styles.loading}>{t('profile.loading')}</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="bio">{t('profile.fields.bio')}</label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder={t('profile.placeholders.bio')}
                                maxLength={300}
                                className={styles.textarea}
                                rows={4}
                            />
                            <small className={styles.charCount}>
                                {bio.length}/300
                            </small>
                        </div>

                        <div className={styles.formGroup}>
                            <label>{t('profile.fields.social_links')}</label>
                            <div className={styles.socialLinks}>
                                {currentLinks.map((link, index) => (
                                    <div key={index} className={styles.socialLink}>
                                        <select
                                            value={link.name}
                                            onChange={(e) => updateLink(index, 'name', e.target.value)}
                                            className={styles.select}
                                            required
                                        >
                                            {Object.values(SocialMediaType).map(type => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                                            placeholder={`${link.name.toLowerCase()}.com/username`}
                                            className={styles.input}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeLink(index)}
                                            className={styles.removeButton}
                                            aria-label={t('profile.actions.remove_link')}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addLink}
                                    className={styles.addButton}
                                >
                                    <FiPlus />
                                    {t('profile.actions.add_link')}
                                </button>
                            </div>
                        </div>

                        {saveError && (
                            <div className={styles.error}>
                                {saveError}
                            </div>
                        )}

                        <div className={styles.actions}>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSaving}
                            >
                                {isSaving ? t('profile.actions.saving') : t('profile.actions.save')}
                            </button>
                        </div>
                    </form>
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

export default ProfileEditor; 