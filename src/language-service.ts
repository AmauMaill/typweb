import { Language, translations } from './translations';

export class LanguageService {
    private currentLang: Language;
    private readonly LANG_KEY = 'preferred_language';

    constructor() {
        const savedLang = localStorage.getItem(this.LANG_KEY) as Language;
        this.currentLang = savedLang || this.getBrowserLanguage();
        this.updateHtmlLang();
    }

    private getBrowserLanguage(): Language {
        const browserLang = navigator.language.split('-')[0];
        return browserLang === 'fr' ? 'fr' : 'en';
    }

    getCurrentLanguage(): Language {
        return this.currentLang;
    }

    toggleLanguage(): void {
        this.currentLang = this.currentLang === 'en' ? 'fr' : 'en';
        localStorage.setItem(this.LANG_KEY, this.currentLang);
        this.updateHtmlLang();
        this.updatePageText();
    }

    private updateHtmlLang(): void {
        document.documentElement.lang = this.currentLang;
    }

    translate(key: string): string {
        const translation = translations[key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
        return translation[this.currentLang];
    }

    async loadPageContent(page: string): Promise<string> {
        try {
            console.log(`Loading page ${page} in ${this.currentLang}`);
            const response = await fetch(`/src/pages/${this.currentLang}/${page}.html`);
            if (!response.ok) {
                // Fallback to English if translation doesn't exist
                console.warn(`No ${this.currentLang} version found for ${page}, falling back to English`);
                const fallbackResponse = await fetch(`/src/pages/en/${page}.html`);
                if (!fallbackResponse.ok) {
                    throw new Error(`Page ${page} not found in any language`);
                }
                return await fallbackResponse.text();
            }
            return await response.text();
        } catch (error) {
            console.error('Error loading page:', error);
            throw error;
        }
    }

    private updatePageText(): void {
        // Update navigation text
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const key = link.getAttribute('data-translate-key');
            if (key) {
                link.textContent = this.translate(key);
            }
        });

        // Update language toggle button
        const langBtn = document.getElementById('langToggle');
        if (langBtn) {
            langBtn.textContent = this.currentLang.toUpperCase();
        }
    }
}