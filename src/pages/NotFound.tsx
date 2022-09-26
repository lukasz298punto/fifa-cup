import { useTranslation } from 'react-i18next';

function NotFound() {
    const { t } = useTranslation();

    return <>{t('404')}</>;
}
export default NotFound;
