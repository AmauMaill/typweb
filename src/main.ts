import './style.css'

interface ContactForm {
    name: string;
    email: string;
    message: string;
}

class Website {
    private currentPage: string = 'home';
    private contentDiv: HTMLElement;
    private navLinks: NodeListOf<HTMLAnchorElement>;

    constructor() {
        this.contentDiv = document.getElementById('content') as HTMLElement;
        this.navLinks = document.querySelectorAll('.nav-link');
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

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.loadPage(page, false);
        });
    }

    private async loadInitialPage(): Promise<void> {
        // Get the current path from the URL
        const path = window.location.pathname;
        const page = path === '/' ? 'home' : path.slice(1);
        await this.loadPage(page, false);
    }

    private async navigateToPage(page: string): Promise<void> {
        // Update URL
        const url = page === 'home' ? '/' : `/${page}`;
        history.pushState({ page }, '', url);
        await this.loadPage(page);
    }

    private async loadPage(page: string, updateState: boolean = true): Promise<void> {
        try {
            const response = await fetch(`/src/pages/${page}.html`);
            if (!response.ok) throw new Error(`Page ${page} not found`);
            
            const html = await response.text();
            this.contentDiv.innerHTML = html;
            
            // Update current page
            this.currentPage = page;
            
            // Update active navigation link
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

    public init(): void {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// Initialize the website
window.addEventListener('DOMContentLoaded', () => {
    const website = new Website();
    website.init();
});