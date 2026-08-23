# Arquitectura

Decisiones estructurales de `cacharreo-hub`. Si algo aquí se contradice con el
código, gana este documento: se corrige el código o se corrige el documento en
un PR, nunca se deja la divergencia.

## 1. Qué es este repo

El sitio principal de `cacharreo.dev`: un índice de accesos rápidos a los
proyectos y el lugar donde viven los **escritos** (ideas y notas pensadas para
durar, no noticias). Es la carta de presentación pública.

**No es** el sitio de ningún proyecto. Cada proyecto vive en su propio repo, su
propio lenguaje y su propio dominio o subdominio. El hub solo enlaza.

## 2. Principios

1. **Estático puro.** `output: 'static'`, sin adapter, sin SSR, sin funciones
   de servidor. Todo se prerenderiza en build. Si una idea exige un servidor,
   no entra al hub: va a un proyecto aparte.
2. **Cero JavaScript de cliente por defecto.** Ninguna página envía JS hoy. Si
   alguna vez hace falta, es JS propio, sin framework, cargado con `is:inline`
   o un `<script>` de Astro, y con mejora progresiva: la página funciona sin él.
3. **El hub enlaza, no aloja.** Frontera dura. Si algo necesita build propio,
   dependencias propias o despliegue propio, es otro repo.
4. **Contenido como datos validados.** Todo el contenido (escritos y proyectos)
   pasa por una colección con esquema Zod. Un dato mal formado rompe el build,
   no la página en producción.
5. **Sin terceros en runtime.** Nada de CDNs, fuentes remotas, analítica con
   cookies ni widgets embebidos. Lo que el navegador pide, lo sirve nuestro
   dominio. Esto permite mantener una CSP estricta.
6. **Preparado para i18n, sin pagar el costo hoy.** Ver §7.

## 3. Stack

| Pieza | Elección | Por qué |
|---|---|---|
| Framework | Astro 7, `output: static` | HTML en build, cero runtime |
| Gestor de paquetes | pnpm (fijado en `packageManager`) | Reproducible, rápido |
| Estilos | CSS plano con custom properties en `global.css` | Sin build extra, sin dependencia de framework CSS |
| Contenido | Content Collections + Zod | Validación en build |
| Feed | `@astrojs/rss` | Estándar |
| Mapa del sitio | `@astrojs/sitemap` | SEO |
| Hosting | Cloudflare Pages | Estático, previews por PR, gratis |

Regla de dependencias: **cada dependencia nueva requiere justificación en el
PR**. El objetivo es poder abrir este repo dentro de dos años y que `pnpm
install && pnpm build` siga funcionando.

## 4. Estructura de carpetas

```
src/
  pages/        Rutas. Solo composición: obtienen datos y los pasan a componentes.
  layouts/      Base.astro (documento + nav + pie) y layouts derivados.
  components/   Presentacionales. Reciben props, no consultan colecciones.
  content/      Contenido en Markdown y datos (escritos, proyectos).
  styles/       global.css: tokens primero, luego capas.
  lib/          Helpers puros y testeables (formato de fechas, orden de posts).
public/         Servido tal cual: _headers, robots.txt, favicon, og por defecto.
docs/           Este directorio.
```

Reglas:

- Una página **no** contiene lógica de negocio. Si hay `filter` + `sort`
  repetidos en tres páginas, se extraen a `src/lib/`.
- Un componente **no** llama a `getCollection`. Recibe datos por props.
- `global.css` se organiza en capas explícitas y comentadas: tokens →
  reset → tipografía → layout → componentes → utilidades. Al pasar de ~400
  líneas, se parte en archivos por capa importados desde `global.css`.

## 5. Modelo de contenido

### Escritos

Colección `escritos` (hoy `blog`), Markdown en `src/content/escritos/`.

```ts
schema: z.object({
  title: z.string(),
  description: z.string(),   // usada en listado, SEO y RSS
  date: z.coerce.date(),
  date: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  autor: z.string().optional(),            // solo si el escrito cita a alguien más
  fuente: z.string().optional(),
  tags: z.array(z.string()).default([]),   // fase 2
})
```

**Orden del listado, la portada y el RSS.** Vive en `src/lib/escritos.ts`, no
en cada página: si los tres no ordenan igual, el sitio se contradice. Primero
los escritos con `date`, del más nuevo al más viejo; al final los que no la
tienen, alfabéticos por título con
`localeCompare('es', { sensitivity: 'base' })`, para que un acento o una
minúscula inicial no los mande al fondo.

`date` es opcional porque un escrito puede ser una cita de la que no se sabe
cuándo se dijo, e inventar una fecha sería mentir en los datos. Sin `date` no
se renderiza `<time>` y el ítem del RSS sale sin `pubDate`.

- `draft: true` nunca se publica ni aparece en RSS ni en el sitemap.
- El `id` del archivo es el slug de la URL. Los nombres de archivo se escriben
  en kebab-case, sin acentos ni fechas.
- Las fechas, cuando existen, se renderizan siempre con `timeZone: 'UTC'` para que no se corran
  un día según el navegador.

### Proyectos

Colección `proyectos`, `src/content/proyectos.json`, cargada con el loader
`file()` y validada en build:

```ts
const proyectos = defineCollection({
  loader: file('./src/content/proyectos.json'),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    url: z.string().url(),
    repo: z.string().url().optional(),
    estado: z.enum(['activo', 'pausado', 'archivado']).optional(),
    orden: z.number().optional(),
  }),
});
```

Un proyecto es **un enlace con contexto**: nombre, una línea de qué hace y para
quién, a dónde va y (opcional) dónde está el código. El hub no describe
arquitecturas de proyectos ajenos; para eso está el README de cada proyecto.

## 6. Rutas y URLs

Las URLs son contrato público. Cambiarlas cuesta; por eso se fijan ahora, con
el sitio aún sin tráfico.

| Ruta | Contenido |
|---|---|
| `/` | Hero + índice de proyectos + últimos escritos |
| `/escritos` | Listado completo de escritos |
| `/escritos/<slug>` | Un escrito |
| `/rss.xml` | Feed |
| `/sitemap-index.xml` | Generado |
| `/404` | No encontrado |

**Deuda a saldar en fase 0:** las rutas son `/blog/*` mientras toda la interfaz
dice «escritos». Se renombran a `/escritos/*` y se deja un redirect 301 desde
`/blog/*` en `public/_redirects`.

Se fija `trailingSlash: 'never'` en `astro.config.mjs` y **todos** los enlaces
internos se escriben sin barra final. Hoy el listado enlaza `/blog/<id>` y el
RSS enlaza `/blog/<id>/`: es la misma página con dos URLs, lo que reparte señal
de SEO sin motivo.

## 7. Camino a multi-idioma (aún no se implementa)

Cuando llegue, se activará así:

```js
i18n: { defaultLocale: 'es', locales: ['es', 'en'], routing: { prefixDefaultLocale: false } }
```

Con eso las URLs actuales en español **no cambian** y el inglés vive bajo
`/en/`. Para que ese día sea barato, desde hoy se respetan tres reglas:

1. El atributo `lang` del `<html>` sale de una variable en `Base.astro`, nunca
   escrito a mano en las páginas.
2. Los formatos de fecha y número reciben el locale como parámetro, no la
   cadena `'es'` incrustada en cada página. Vive en `src/lib/fechas.ts`.
3. Los textos fijos de la interfaz (nav, pie, etiquetas) se concentran en
   `Base.astro` y en los componentes, no dispersos en cada página.

No se crean carpetas ni archivos de i18n vacíos «por si acaso».

## 8. Rendimiento y front-end

- **Fuentes:** hoy se cargan desde Google Fonts, lo que añade dos conexiones a
  terceros en la ruta crítica y obliga a abrir la CSP a `fonts.googleapis.com`
  y `fonts.gstatic.com`. Se migran a `@fontsource-variable/*` servidas desde el
  propio dominio, con `font-display: swap` y `preload` del peso principal. Al
  hacerlo, esos dos orígenes salen de la CSP.
- **Imágenes:** cuando existan, se usa `astro:assets` (`<Image />`), nunca
  `<img>` a un archivo suelto en `public/`. Ancho y alto siempre presentes.
- **Presupuesto:** una página del hub no debería superar ~150 KB transferidos
  ni enviar JS. Es una barrera, no un objetivo a optimizar.

## 9. SEO y metadatos

- `canonical` y `og:*` ya salen de `Base.astro`.
- Falta y se añade en fase 0: `og:image` por defecto (imagen estática en
  `public/`), `twitter:card: summary_large_image` y `og:type: article` con
  `article:published_time` en las páginas de escrito.
- `description` es obligatoria en el esquema, así que ninguna página queda sin
  meta description.

## 10. Seguridad

`public/_headers` ya define CSP, HSTS, `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` y COOP. Reglas para
mantenerlo:

- **Ningún cambio puede introducir `unsafe-inline` en `script-src`.** Si un
  cambio lo exige, el cambio está mal planteado.
- `style-src 'unsafe-inline'` se mantiene solo mientras Astro inyecte estilos
  en línea; se revisa al eliminar Google Fonts.
- Cada origen de terceros que se agregue a la CSP requiere justificación
  explícita en el PR. La ambición es que la lista quede en `'self'`.
