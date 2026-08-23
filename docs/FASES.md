# Fases

Cada fase tiene un objetivo, una lista de trabajo y un criterio de salida
verificable. No se empieza una fase con la anterior a medias.

---

## Fase 0 — Ordenar la casa

**Objetivo:** que el repo sea coherente consigo mismo y seguro de publicar,
antes de que exista contenido real. Nada de esto se abarata esperando.

**Trabajo:**

- [x] Documentación de arquitectura, alcance, fases y despliegue (este directorio).
- [x] Quitar la página `/apoyar`, su enlace en el nav y el bloque de la portada.
      Razón en `ALCANCE.md`; el enlace de Ko-fi hoy es un placeholder roto.
- [ ] Renombrar rutas `/blog/*` → `/escritos/*` y la colección `blog` →
      `escritos`. Redirect 301 desde `/blog/*` en `public/_redirects`.
- [x] Fijar `trailingSlash: 'never'` y unificar todos los enlaces internos
      (hoy el listado y el RSS enlazan el mismo post con y sin barra final).
- [~] Migrar `src/data/proyectos.json` a colección con loader `file()` y
      esquema Zod: hecho. Falta reemplazar el proyecto «Ejemplo» por uno real
      o vaciar la lista (el estado vacío ya está resuelto).
- [ ] Añadir `og:image` por defecto, `twitter:card` y `article:published_time`
      en las páginas de escrito.
- [ ] Self-hostear las fuentes con `@fontsource-variable` y quitar
      `fonts.googleapis.com` y `fonts.gstatic.com` de la CSP.
- [x] Fijar versión de Node (`.nvmrc` + variable `NODE_VERSION` en Cloudflare).
- [x] `astro check` en el proyecto (`@astrojs/check` + `typescript`); falta
      convertir `src/pages/rss.xml.js` a `.ts`.
- [ ] CI en GitHub Actions: `install` → `astro check` → `build` en cada PR.
- [ ] Proteger `main`: sin push directo, PR obligatorio, CI en verde para
      poder mergear.

**Criterio de salida:** `pnpm build` y `astro check` pasan en limpio; no queda
ningún enlace placeholder ni texto de ejemplo en el sitio publicado; un PR de
prueba genera preview y CI verde; `/blog/hola-mundo` redirige a
`/escritos/hola-mundo`.

---

## Fase 1 — Sitio público real

**Objetivo:** que el sitio se pueda compartir sin advertencias.

**Trabajo:**

- [ ] Entre 3 y 5 escritos reales publicados. Es el contenido que sostiene el
      sitio; sin esto, el resto es andamiaje.
- [ ] Entre 1 y 3 proyectos reales en el índice, cada uno con su URL viva.
- [ ] Revisar textos del hero, listados y 404 con contenido real ya en su sitio.
- [ ] Verificación de accesibilidad: contraste sobre el fondo de manchas, foco
      visible en todos los enlaces, navegación completa por teclado, jerarquía
      de encabezados correcta en cada página.
- [ ] Lighthouse ≥ 95 en las cuatro categorías, en móvil.
- [ ] Favicon y `og:image` con la identidad definitiva.

**Criterio de salida:** el sitio se puede enviar a alguien sin decir «ignora
esa parte».

---

## Fase 2 — Que el contenido se pueda recorrer

**Objetivo:** con volumen de escritos, que encontrar algo sea fácil.

**Trabajo:**

- [ ] Página `/sobre`: quién es, en qué trabaja, cómo contactar.
- [ ] Etiquetas en los escritos, con páginas `/escritos/tag/<tag>` generadas
      en build.
- [ ] Búsqueda con Pagefind: índice generado en el build, sin backend.
- [ ] Imagen OG por escrito, generada en build.
- [ ] Enlaces «anterior / siguiente» entre escritos.

**Criterio de salida:** con 15 escritos publicados, encontrar uno concreto
toma menos de tres clics.

---

## Fase 3 — Apoyar

**Objetivo:** reactivar la vía de apoyo, con la decisión ya tomada.

**Requisito previo, no negociable:** cuenta de Ko-fi (u otra plataforma)
creada y verificada, y claridad sobre implicaciones fiscales y sobre qué se
promete a quien aporta.

**Trabajo:**

- [ ] Restaurar la página `/apoyar` con enlace real, recuperándola del
      historial de git.
- [ ] Texto explícito sobre a qué se destinan los aportes y qué no garantizan.
- [ ] Revisar la CSP si la plataforma exige algún origen adicional.

**Criterio de salida:** ningún enlace de pago apunta a un placeholder y el
texto no promete nada que no se vaya a cumplir.

---

## Fase 4 — Multi-idioma

**Objetivo:** publicar en inglés sin romper lo que ya está indexado.

**Trabajo:**

- [ ] Activar `i18n` con `prefixDefaultLocale: false` para que las URLs en
      español no cambien.
- [ ] Extraer los textos de interfaz a diccionarios por idioma.
- [ ] Traducir por escrito, no en bloque: un escrito puede existir solo en
      español, y el listado debe manejarlo.
- [ ] `hreflang` en el `<head>` y selector de idioma en el nav.
- [ ] Feeds RSS separados por idioma.

**Criterio de salida:** ninguna URL en español cambió y no hay páginas en
inglés a medio traducir.

---

## Fuera de fases

Ideas registradas sin compromiso de hacerlas: `/uses` (herramientas), «now»
(en qué anda), notas cortas tipo microblog, boletín. Se evalúan cuando el
sitio lleve tiempo vivo y haya señal de que hacen falta.
