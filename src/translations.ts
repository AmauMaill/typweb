export type Language = 'en' | 'fr';

interface Translations {
    [key: string]: {
        en: string;
        fr: string;
    };
}

export const translations: Translations = {
    'nav.home': {
        en: 'Home',
        fr: 'Accueil'
    },
    'nav.about': {
        en: 'About',
        fr: 'À propos'
    },
    'nav.projects': {
        en: 'Projects',
        fr: 'Projets'
    },
    'nav.contact': {
        en: 'Contact',
        fr: 'Contact'
    }
};