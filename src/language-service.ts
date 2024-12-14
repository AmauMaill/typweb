import { Language, translations } from './translations';

export class LanguageService {
    private currentLang: Language;
    private readonly LANG_KEY = 'preferred_language';
    private readonly basePath: string;

    constructor() {
        const savedLang = localStorage.getItem(this.LANG_KEY) as Language;
        this.currentLang = savedLang || this.getBrowserLanguage();
        this.basePath = this.getBasePath();
        this.updateHtmlLang();
    }

    private getBasePath(): string {
        const pathSegments = window.location.pathname.split('/');
        const repoName = pathSegments[1];
        return repoName ? `/${repoName}` : '';
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
            // Normalize the page name to prevent issues with slashes
            const normalizedPage = page.replace(/^\/+|\/+$/g, '');
            console.log(`Loading page ${normalizedPage} in ${this.currentLang}`);

            // Build the path based on environment
            let pagePath: string;
            if (import.meta.env.PROD) {
                // Use absolute path in production
                pagePath = `${this.basePath}/pages/${this.currentLang}/${normalizedPage}.html`;
            } else {
                // Use source path in development
                pagePath = `/src/pages/${this.currentLang}/${normalizedPage}.html`;
            }

            console.log('Attempting to load:', pagePath);
            let response = await fetch(pagePath);

            // Try English version if current language version isn't found
            if (!response.ok && this.currentLang !== 'en') {
                console.log(`No ${this.currentLang} version found for ${normalizedPage}, trying English...`);
                const englishPath = import.meta.env.PROD
                    ? `${this.basePath}/pages/en/${normalizedPage}.html`
                    : `/src/pages/en/${normalizedPage}.html`;
                
                console.log('Attempting English fallback:', englishPath);
                response = await fetch(englishPath);
                
                if (!response.ok) {
                    throw new Error(`Page ${normalizedPage} not found in any language`);
                }
            }

            let content = await response.text();
            
            // If we accidentally got a full HTML document, try to extract just the content
            if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
                console.warn('Received full HTML document instead of content fragment');
                // Try to extract content from within a specific div
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const pageContent = tempDiv.querySelector('.page-content, main, .content, #content');
                if (pageContent) {
                    content = pageContent.innerHTML;
                }
            }
            
            console.log('Processed content:', content.substring(0, 100) + '...');
            return content;
            
        } catch (error) {
            console.error('Error loading page:', error);
            return '<div class="error">Error loading page content</div>';
        }
    }

    private updatePageText(): void {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const key = link.getAttribute('data-translate-key');
            if (key) {
                link.textContent = this.translate(key);
            }
        });

        const langBtn = document.getElementById('langToggle');
        if (langBtn) {
            langBtn.textContent = this.currentLang.toUpperCase();
        }
    }
}