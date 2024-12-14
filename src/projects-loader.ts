import { marked } from 'marked';

interface ImportedContent {
    [key: string]: () => Promise<string>;
}

export class ProjectsLoader {
    private creatorProjectsDiv: HTMLElement | null = null;
    private contributorProjectsDiv: HTMLElement | null = null;
    private currentLang: string;

    constructor() {
        this.currentLang = document.documentElement.lang || 'en';
    }

    async initialize() {
        console.log('Initializing ProjectsLoader');
        
        this.creatorProjectsDiv = document.getElementById('creator-projects');
        this.contributorProjectsDiv = document.getElementById('contributor-projects');

        if (this.creatorProjectsDiv && this.contributorProjectsDiv) {
            await this.loadProjects();
            this.styleProjectLinks();
        } else {
            console.error('Could not find project container divs');
        }
    }

    private async loadProjectFiles(directory: string): Promise<string[]> {
        try {
            const enFiles = import.meta.glob('/src/pages/projects/**/en/*.md', { query: '?raw', import: 'default' }) as ImportedContent;
            const frFiles = import.meta.glob('/src/pages/projects/**/fr/*.md', { query: '?raw', import: 'default' }) as ImportedContent;
            
            const files = this.currentLang === 'fr' ? frFiles : enFiles;
            
            const loadedFiles = await Promise.all(
                Object.keys(files)
                    .filter(file => file.includes(directory))
                    .map(async file => {
                        const content = await files[file]();
                        return this.wrapInProjectCard(await marked.parse(content));
                    })
            );

            return loadedFiles;
        } catch (error) {
            console.error(`Error loading projects from ${directory}:`, error);
            return [];
        }
    }

    private wrapInProjectCard(html: string): string {
        return `<div class="project-card">${html}</div>`;
    }

    private async loadProjects() {
        try {
            const creatorHtmlFiles = await this.loadProjectFiles('creator');
            if (this.creatorProjectsDiv && creatorHtmlFiles.length > 0) {
                this.creatorProjectsDiv.innerHTML = creatorHtmlFiles.join('');
            }

            const contributorHtmlFiles = await this.loadProjectFiles('contributor');
            if (this.contributorProjectsDiv && contributorHtmlFiles.length > 0) {
                this.contributorProjectsDiv.innerHTML = contributorHtmlFiles.join('');
            }
        } catch (error) {
            console.error('Error in loadProjects:', error);
        }
    }

    private styleProjectLinks() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const links = card.querySelectorAll('a');
            
            links.forEach(link => {
                link.classList.add('link-button', 'primary');
            });
        });
    }
}