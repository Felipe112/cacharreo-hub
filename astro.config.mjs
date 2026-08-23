// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cacharreo.dev',
  // Una sola URL canónica por página: sin barra final en ningún enlace interno.
  trailingSlash: 'never',
  // La barra flotante de Astro solo existe en `dev`, pero no se quiere ni ahí:
  // el sitio se revisa siempre tal como se publica.
  devToolbar: { enabled: false },
  integrations: [sitemap()],
});
