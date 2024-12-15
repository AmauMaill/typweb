import { defineConfig } from 'vite';
import path from 'path';
import raw from 'vite-plugin-raw';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@custom-types': path.resolve(__dirname, './src/types'),
    },
    extensions: ['.ts', '.js', '.scss', '.css', '.md'],
  },

  // Explicitly include md files in the assetsInclude
  assetsInclude: ['**/*.md'],

  plugins: [
    // raw({
    //   include: ['**/*.html', '**/*.md', '**/*.css'], // Handle raw HTML, MD, and CSS
    //   exclude: ['@vite/client', '**/*.ts'], // Exclude Vite internal client and .ts files
    // }),
  ],
});
