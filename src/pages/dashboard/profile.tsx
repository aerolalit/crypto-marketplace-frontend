import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { ProfileEditor } from '../../components/profile/ProfileEditor';

const ProfilePage = () => {
    return (
        <DashboardLayout>
            <ProfileEditor />
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

export default ProfilePage; 