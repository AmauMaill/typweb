import './styles/main.css';

import { LanguageService } from '@services/LanguageService';
import { NavigationService } from '@services/NavigationService';
import { ProjectsLoader } from '@utils/ProjectsLoader';
import { ContactForm } from '@custom-types/index';

class Website {
    private languageService: LanguageService;
    private navigationService: NavigationService;
    private projectsLoader: ProjectsLoader | null = null;

    constructor(
        private contentDiv: HTMLElement,
        private navLinks: NodeListOf<HTMLAnchorElement>,
        private langToggle: HTMLButtonElement
    ) {
        this.languageService = new LanguageService();
        this.navigationService = new NavigationService(contentDiv, navLinks);
        this.initializeEventListeners();
        this.loadInitialPage();
    }

    private initializeEventListeners(): void {
        this.initializeNavigation();
        this.initializeLanguageToggle();
        this.initializeHistoryNavigation();
    }

    private initializeNavigation(): void {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page || 'home';
                this.navigationService.navigateToPage(page);
                this.loadPage(page);
            });
        });
    }

    private initializeLanguageToggle(): void {
        this.langToggle?.addEventListener('click', () => {
            this.languageService.toggleLanguage();
            this.loadPage(this.navigationService.getCurrentPage());
        });
    }

    private initializeHistoryNavigation(): void {
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.loadPage(page);
        });
    }

    private async loadInitialPage(): Promise<void> {
        const pathSegments = window.location.pathname.split('/');
        const page = pathSegments[pathSegments.length - 1] || 'home';
        await this.loadPage(page);
    }

    private async loadPage(page: string): Promise<void> {
        try {
            const html = await this.languageService.loadPageContent(page);
            this.contentDiv.innerHTML = html;
            this.initializePageFeatures();
        } catch (error) {
            console.error('Error loading page:', error);
            this.contentDiv.innerHTML = '<h1>Page Not Found</h1>';
        }
    }

    private initializePageFeatures(): void {
        this.initializeThemeToggle();
        this.initializeContactForm();
        this.initializeProjects();
    }

    private initializeThemeToggle(): void {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDarkTheme = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        });
    }

    private initializeContactForm(): void {
        const contactForm = document.getElementById('contactForm');
        contactForm?.addEventListener('submit', this.handleFormSubmit);
    }

    private initializeProjects(): void {
        const creatorDiv = document.getElementById('creator-projects');
        const contributorDiv = document.getElementById('contributor-projects');
        
        if (creatorDiv && contributorDiv) {
            this.projectsLoader = new ProjectsLoader(
                creatorDiv,
                contributorDiv,
                this.languageService.getCurrentLanguage()
            );
            this.projectsLoader.initialize();
        }
    }

    private async handleFormSubmit(e: Event): Promise<void> {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        const formData: ContactForm = {
            name: (form.querySelector('#name') as HTMLInputElement).value,
            email: (form.querySelector('#email') as HTMLInputElement).value,
            message: (form.querySelector('#message') as HTMLTextAreaElement).value
        };

        try {
            console.log('Form submitted:', formData);
            form.reset();
            alert('Message sent successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please try again.');
        }
    }
}

// Initialize the website
window.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const navLinks = document.querySelectorAll('.nav-link');
    const langToggle = document.getElementById('langToggle');

    if (contentDiv && navLinks.length && langToggle) {
        new Website(
            contentDiv as HTMLElement,
            navLinks as NodeListOf<HTMLAnchorElement>,
            langToggle as HTMLButtonElement
        );
    } else {
        console.error('Required DOM elements not found');
    }
});