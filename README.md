# cacharreo-hub

Sitio principal de [cacharreo.dev](https://cacharreo.dev)

## Documentación

Antes de cambiar algo, leer lo que corresponda:

- [Arquitectura](docs/ARQUITECTURA.md) — principios, estructura, modelo de contenido, URLs.
- [Alcance](docs/ALCANCE.md) — qué entra, qué no y por qué.
- [Fases](docs/FASES.md) — en qué punto está el proyecto y qué sigue.
- [Despliegue y procesos](docs/DESPLIEGUE.md) — ramas, PR, CI, rollback.

## Stack

Astro (estático)

## Desarrollo

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm check    # astro check: tipos y plantillas
pnpm build    # astro check + genera dist/
pnpm preview  # sirve dist/
```

La versión de Node está fijada en `.nvmrc`.

## Agregar un proyecto al índice

El hub solo enlaza. Los proyectos viven en sus propios repos, lenguajes y
dominios. Para listar uno, editar `src/content/proyectos.json`:

```json
{
  "id": "slug-unico",
  "nombre": "Nombre visible",
  "descripcion": "Una línea, qué hace y para quién.",
  "url": "https://donde-vive-el-proyecto.com",
  "repo": "https://github.com/Felipe112/repo",
  "estado": "activo",
  "orden": 1
}
```

`id`, `nombre`, `descripcion` y `url` son obligatorios. `repo`, `estado`
(`activo` | `pausado` | `archivado`) y `orden` son opcionales: si faltan, no se
muestran. El esquema se valida en build: un dato mal formado rompe `pnpm build`
en vez de llegar a producción. Con la lista vacía la portada muestra su estado
vacío.

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

`date` es opcional. Los escritos con fecha se listan primero, del más nuevo al
más viejo; los que no la tienen van al final en orden alfabético por título. Si
no sabes la fecha, déjala afuera en vez de inventar una.

Si el escrito cita a alguien más, el texto va en blockquote (`>`) y se agregan
`autor` y `fuente` al frontmatter. Se renderizan como atribución bajo la cita;
si faltan, no se muestra nada.

```markdown
---
title: "Fluir"
description: "Una línea para SEO y redes."
draft: false
autor: "Mihaly Csikszentmihalyi"
fuente: "Fluir"
---

> La cita, tal cual.
```

## Despliegue

Push a `main` → Cloudflare Pages construye y publica.

- Build command: `pnpm build`
- Output directory: `dist`
