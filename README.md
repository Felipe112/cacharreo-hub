# cacharreo-hub

Sitio principal de [cacharreo.dev](https://cacharreo.dev)

## Stack

Astro (estático)

## Desarrollo

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # genera dist/
pnpm preview  # sirve dist/
```

## Agregar un proyecto al índice

El hub solo enlaza. Los proyectos viven en sus propios repos, lenguajes y
dominios. Para listar uno, editar `src/data/proyectos.json`:

```json
{
  "nombre": "Nombre visible",
  "descripcion": "Una línea, qué hace y para quién.",
  "url": "https://donde-vive-el-proyecto.com",
  "repo": "https://github.com/Felipe112/repo",
  "estado": "activo"
}
```

`nombre`, `descripcion` y `url` son obligatorios. `repo` y `estado` son
opcionales: si faltan, no se muestran.

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

- Build command: `pnpm build`
- Output directory: `dist`
