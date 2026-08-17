import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://zmx27.github.io',
  base: '/my-portfolio/',
  vite: {
    plugins: [tailwindcss()],
  },
});
