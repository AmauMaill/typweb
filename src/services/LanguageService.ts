import { Language } from '../types';
import { translations } from '../constants/translations';

export class LanguageService {
    private currentLang: Language;
    private readonly LANG_KEY = 'preferred_language';
    private readonly basePath: string;

    constructor() {
        this.currentLang = this.initializeLanguage();
        this.basePath = this.getBasePath();
        this.updateHtmlLang();
    }

    private initializeLanguage(): Language {
        const savedLang = localStorage.getItem(this.LANG_KEY) as Language;
        return savedLang || this.getBrowserLanguage();
    }

    private getBasePath(): string {
        const pathSegments = window.location.pathname.split('/');
        const repoName = pathSegments[1];
        return repoName ? `/${repoName}` : '';
    }

    private getBrowserLanguage(): Language {
        return navigator.language.startsWith('fr') ? 'fr' : 'en';
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
        const normalizedPage = page.replace(/^\/+|\/+$/g, '');
        const pagePath = this.buildPagePath(normalizedPage);
        
        try {
            let response = await fetch(pagePath);
            
            if (!response.ok && this.currentLang !== 'en') {
                response = await this.tryEnglishFallback(normalizedPage);
            }

            const content = await response.text();
            return this.extractPageContent(content);
        } catch (error) {
            console.error('Error loading page:', error);
            return '<div class="error">Error loading page content</div>';
        }
    }

    private buildPagePath(page: string): string {
        const base = import.meta.env.PROD ? this.basePath : '/src';
        return `${base}/pages/${this.currentLang}/${page}.html`;
    }

    private async tryEnglishFallback(page: string): Promise<Response> {
        const englishPath = this.buildPagePath(page).replace(`/${this.currentLang}/`, '/en/');
        const response = await fetch(englishPath);
        
        if (!response.ok) {
            throw new Error(`Page ${page} not found in any language`);
        }
        
        return response;
    }

    private extractPageContent(html: string): string {
        if (!html.includes('<!DOCTYPE html>') && !html.includes('<html')) {
            return html;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const content = tempDiv.querySelector('.page-content, main, .content, #content');
        return content?.innerHTML || html;
    }

    private updatePageText(): void {
        document.querySelectorAll('.nav-link').forEach(link => {
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