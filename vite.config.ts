import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || ''}` 
    : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  // This ensures your pages are handled correctly during development
  server: {
    fs: {
      // Allow serving files from one level up from the package root
      allow: ['..']
    }
  }
});