export type Language = 'en' | 'fr';

export interface Translation {
    en: string;
    fr: string;
}

export interface ContactForm {
    name: string;
    email: string;
    message: string;
}