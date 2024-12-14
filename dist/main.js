"use strict";
class Website {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.contactForm = document.getElementById('contactForm');
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }
    async handleFormSubmit(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        try {
            // Here you would typically send the data to a server
            console.log('Form submitted:', formData);
            this.contactForm.reset();
            alert('Message sent successfully!');
        }
        catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please try again.');
        }
    }
    init() {
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
    "compilerOptions";
    {
        "target";
        "ES2020",
            "module";
        "ES2020",
            "strict";
        true,
            "esModuleInterop";
        true,
            "skipLibCheck";
        true,
            "forceConsistentCasingInFileNames";
        true,
            "outDir";
        "./dist";
    }
    "include";
    ["src/**/*"],
        "exclude";
    ["node_modules"];
}
