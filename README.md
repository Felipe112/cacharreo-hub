# cacharreo-hub

Sitio principal de [cacharreo.dev](https://cacharreo.dev): presentación, índice
de proyectos, blog y página de donativos.

## Stack

Astro (estático) → Cloudflare Pages.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
```

## Agregar un proyecto al índice

Editar `src/data/proyectos.json`:

```json
{
  "nombre": "Nombre visible",
  "slug": "slug-del-proyecto",
  "descripcion": "Una línea, qué hace y para quién.",
  "url": "https://slug-del-proyecto.cacharreo.dev",
  "repo": "https://github.com/Felipe112/cacharreo-slug-del-proyecto",
  "estado": "activo"
}
```

## Escribir una entrada del blog

Crear `src/content/blog/mi-entrada.md`:

```markdown
---
title: "Título"
description: "Una línea para SEO y redes."
date: 2026-08-18
draft: false
---

Contenido en Markdown.
```

Con `draft: true` no se publica.

## Despliegue

Push a `main` → Cloudflare Pages construye y publica.

- Build command: `npm run build`
- Output directory: `dist`
