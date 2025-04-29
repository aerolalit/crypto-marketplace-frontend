import { useTranslation } from 'next-i18next';
import styles from '../../styles/Merchant.module.css';

interface Group {
    id: string;
    name: string;
    link: string;
}

interface GroupSearchProps {
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onSearch: () => void;
    isSearching: boolean;
    searchResults: Group[];
    onGroupSelect: (group: Group) => void;
}

export const GroupSearch = ({
    searchQuery,
    onSearchQueryChange,
    onSearch,
    isSearching,
    searchResults,
    onGroupSelect,
}: GroupSearchProps) => {
    const { t } = useTranslation('common');

    return (
        <div className={styles.stepContent}>
            <h2>{t('merchant.steps.search_group')}</h2>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    placeholder={t('merchant.search.placeholder')}
                    onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                />
                <button onClick={onSearch} disabled={isSearching}>
                    {isSearching ? t('merchant.search.searching') : 'Search'}
                </button>
            </div>
            <div className={styles.searchResults}>
                {searchResults.map((group) => (
                    <button
                        key={group.id}
                        className={styles.groupCard}
                        onClick={() => onGroupSelect(group)}
                        type="button"
                    >
                        <h3>{group.name}</h3>
                        <p>{group.link}</p>
                    </button>
                ))}
                {searchResults.length === 0 && !isSearching && (
                    <p>{t('merchant.search.no_results')}</p>
                )}
            </div>
        </div>
    );
}; 