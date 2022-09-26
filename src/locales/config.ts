import i18n from 'i18next';
import translationENGB from 'locales/enGB/translation.json';
import translationPL from 'locales/pl/translation.json';
import { initReactI18next } from 'react-i18next';

const resources = {
    enGB: {
        translation: translationENGB,
    },
    pl: {
        translation: translationPL,
    },
};

i18n.use(initReactI18next).init({
    resources,
    keySeparator: false,
    interpolation: {
        escapeValue: false,
    },
    lng: 'pl',
});

export default i18n;
