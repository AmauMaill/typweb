import './styles/main.css'
import { LanguageService } from './language-service';

interface ContactForm {
    name: string;
    email: string;
    message: string;
}

class Website {
    private currentPage: string = 'home';
    private contentDiv: HTMLElement;
    private navLinks: NodeListOf<HTMLAnchorElement>;
    private languageService: LanguageService;
    private langToggle: HTMLButtonElement;

    constructor() {
        this.contentDiv = document.getElementById('content') as HTMLElement;
        this.navLinks = document.querySelectorAll('.nav-link');
        this.langToggle = document.getElementById('langToggle') as HTMLButtonElement;
        this.languageService = new LanguageService();
        
        this.initializeEventListeners();
        this.loadInitialPage();
    }

    private initializeEventListeners(): void {
        // Handle navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page || 'home';
                this.navigateToPage(page);
            });
        });

        // Handle language toggle
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => {
                this.languageService.toggleLanguage();
                this.loadPage(this.currentPage);
            });
        }

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.loadPage(page);
        });
    }

    private async loadInitialPage(): Promise<void> {
        // Get the current path from the URL
        const path = window.location.pathname;
        const page = path === '/' ? 'home' : path.slice(1);
        await this.loadPage(page);
    }

    private async navigateToPage(page: string): Promise<void> {
        // Update URL
        const url = page === 'home' ? '/' : `/${page}`;
        history.pushState({ page }, '', url);
        await this.loadPage(page);
    }

    private async loadPage(page: string): Promise<void> {
        try {
            const html = await this.languageService.loadPageContent(page);
            
            // Update content area only
            if (this.contentDiv) {
                this.contentDiv.innerHTML = html;
            }
            
            // Update current page and active link
            this.currentPage = page;
            this.updateActiveNavLink();

            // Initialize page-specific features
            this.initializePageFeatures();
            
            // Initialize projects loader if on projects page
            if (page === 'projects') {
                const { ProjectsLoader } = await import('./projects-loader');
                const projectsLoader = new ProjectsLoader();
                await projectsLoader.initialize();
            }
        } catch (error) {
            console.error('Error loading page:', error);
            this.contentDiv.innerHTML = '<h1>Page Not Found</h1>';
        }
    }

    private updateActiveNavLink(): void {
        this.navLinks.forEach(link => {
            const isActive = link.dataset.page === this.currentPage;
            link.classList.toggle('active', isActive);
        });
    }

    private initializePageFeatures(): void {
        // Initialize theme toggle if it exists on the current page
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Initialize contact form if it exists on the current page
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    private toggleTheme(): void {
        document.body.classList.toggle('dark-theme');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }

    private async handleFormSubmit(e: Event): Promise<void> {
        e.preventDefault();

        const formData: ContactForm = {
            name: (document.getElementById('name') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            message: (document.getElementById('message') as HTMLTextAreaElement).value
        };

        try {
            // Here you would typically send the data to a server
            console.log('Form submitted:', formData);
            (e.target as HTMLFormElement).reset();
            alert('Message sent successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please try again.');
        }
    }
}

// Initialize the website
window.addEventListener('DOMContentLoaded', () => {
    new Website();
});