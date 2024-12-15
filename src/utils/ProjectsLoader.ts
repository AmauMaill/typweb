import { marked } from 'marked';

type ImportedContent = Record<string, () => Promise<string>>;

export class ProjectsLoader {
    constructor(
        private creatorProjectsDiv: HTMLElement | null = null,
        private contributorProjectsDiv: HTMLElement | null = null,
        private currentLang: string = document.documentElement.lang || 'en'
    ) {}

    async initialize(): Promise<void> {
        if (!this.creatorProjectsDiv || !this.contributorProjectsDiv) {
            console.error('Could not find project container divs');
            return;
        }

        await this.loadProjects();
        this.styleProjectLinks();
    }

    private async loadProjectFiles(directory: string): Promise<string[]> {
        try {
            const files = this.getProjectFiles();
            return await this.processProjectFiles(await files, directory);
        } catch (error) {
            console.error(`Error loading projects from ${directory}:`, error);
            return [];
        }
    }

    private async getProjectFiles(): Promise<ImportedContent> {
      
        // Dynamically import markdown files based on the current language
        const files: Record<string, () => Promise<string>> = this.currentLang === 'fr'
          ? import.meta.glob("/src/pages/projects/fr/{contributor,creator}/*.md", { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>
          : import.meta.glob("/src/pages/projects/en/{contributor,creator}/*.md", { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;
      
        // Load and map resolved content to their file paths
        const importedFiles: ImportedContent = {};
        for (const [path, loader] of Object.entries(files)) {
          importedFiles[path] = async () => await loader(); // Resolve and store the raw content
        }
      
        return importedFiles;
      }
      
      
    private async processProjectFiles(files: ImportedContent, directory: string): Promise<string[]> {
        const relevantFiles = Object.entries(files)
            .filter(([path]) => path.includes(directory));

        return Promise.all(
            relevantFiles.map(async ([, loader]) => {
                const content = await loader();
                const parsedContent = await marked.parse(content);
                return this.wrapInProjectCard(parsedContent);
            })
        );
    }

    private wrapInProjectCard(html: string): string {
        return `<div class="project-card">${html}</div>`;
    }

    private async loadProjects(): Promise<void> {
        const [creatorHtml, contributorHtml] = await Promise.all([
            this.loadProjectFiles('creator'),
            this.loadProjectFiles('contributor')
        ]);

        if (this.creatorProjectsDiv && creatorHtml.length > 0) {
            this.creatorProjectsDiv.innerHTML = creatorHtml.join('');
        }

        if (this.contributorProjectsDiv && contributorHtml.length > 0) {
            this.contributorProjectsDiv.innerHTML = contributorHtml.join('');
        }
    }

    private styleProjectLinks(): void {
        document.querySelectorAll('.project-card a').forEach(link => {
            link.classList.add('link-button', 'primary');
        });
    }
}