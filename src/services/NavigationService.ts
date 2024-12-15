export class NavigationService {
    private currentPage: string = 'home';
    private readonly basePath: string;

    constructor(
        private contentDiv: HTMLElement,
        private navLinks: NodeListOf<HTMLAnchorElement>
    ) {
        this.basePath = this.getBasePath();
    }

    private getBasePath(): string {
        const pathSegments = window.location.pathname.split('/');
        const repoName = pathSegments[1];
        return repoName ? `/${repoName}` : '';
    }

    async navigateToPage(page: string): Promise<void> {
        const url = page === 'home' ? this.basePath || '/' : `${this.basePath}/${page}`;
        history.pushState({ page }, '', url);
        this.currentPage = page;
        this.updateActiveNavLink();
    }

    getCurrentPage(): string {
        return this.currentPage;
    }

    private updateActiveNavLink(): void {
        this.navLinks.forEach(link => {
            const isActive = link.dataset.page === this.currentPage;
            link.classList.toggle('active', isActive);
        });
    }
}