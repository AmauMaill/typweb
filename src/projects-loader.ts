export class ProjectsLoader {
    private creatorProjectsDiv: HTMLElement | null = null;
    private contributorProjectsDiv: HTMLElement | null = null;

    async initialize() {
        console.log('Initializing ProjectsLoader');
        
        this.creatorProjectsDiv = document.getElementById('creator-projects');
        this.contributorProjectsDiv = document.getElementById('contributor-projects');

        if (this.creatorProjectsDiv && this.contributorProjectsDiv) {
            await this.loadProjects();
        } else {
            console.error('Could not find project container divs');
        }
    }

    private async loadProjectFiles(directory: string): Promise<string[]> {
        try {
            // Using Vite's glob import feature to get all HTML files
            const files = import.meta.glob('/src/pages/projects/**/*.html', { as: 'raw' });
            
            // Filter files based on directory
            const projectFiles = Object.keys(files)
                .filter(file => file.includes(directory))
                .map(file => files[file]());

            return await Promise.all(projectFiles);
        } catch (error) {
            console.error(`Error loading projects from ${directory}:`, error);
            return [];
        }
    }

    private async loadProjects() {
        try {
            // Load creator projects
            const creatorHtmlFiles = await this.loadProjectFiles('creator');
            if (this.creatorProjectsDiv && creatorHtmlFiles.length > 0) {
                this.creatorProjectsDiv.innerHTML = creatorHtmlFiles.join('');
            }

            // Load contributor projects
            const contributorHtmlFiles = await this.loadProjectFiles('contributor');
            if (this.contributorProjectsDiv && contributorHtmlFiles.length > 0) {
                this.contributorProjectsDiv.innerHTML = contributorHtmlFiles.join('');
            }

        } catch (error) {
            console.error('Error in loadProjects:', error);
        }
    }
}