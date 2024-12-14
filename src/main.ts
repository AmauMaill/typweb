interface ContactForm {
    name: string;
    email: string;
    message: string;
}

class Website {
    private themeToggle: HTMLButtonElement;
    private contactForm: HTMLFormElement;

    constructor() {
        this.themeToggle = document.getElementById('themeToggle') as HTMLButtonElement;
        this.contactForm = document.getElementById('contactForm') as HTMLFormElement;
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
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
            this.contactForm.reset();
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

// tsconfig.json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "ES2020",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "outDir": "./dist"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
}