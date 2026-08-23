# Despliegue y procesos

## Entornos

| Entorno | Origen | URL |
|---|---|---|
| Local | `pnpm dev` | `http://localhost:4321` |
| Preview | cualquier rama con PR abierto | URL efímera de Cloudflare Pages |
| Producción | rama `main` | `https://cacharreo.dev` |

No hay staging permanente: la preview del PR cumple esa función y muere con el
PR.

## Cloudflare Pages

| Ajuste | Valor |
|---|---|
| Build command | `pnpm build` |
| Output directory | `dist` |
| Rama de producción | `main` |
| `NODE_VERSION` | la misma que `.nvmrc` |
| Variables de entorno | ninguna (el sitio no tiene secretos) |

Si algún día hace falta un secreto, no entra al repo: se configura en
Cloudflare y se documenta aquí qué es y para qué, nunca su valor.

`public/_headers` y `public/_redirects` los interpreta Cloudflare Pages y se
copian tal cual a `dist/`. Un error de sintaxis ahí **no rompe el build**: se
verifica en la preview antes de mergear.

## Flujo de trabajo

Trabajo en rama, siempre. `main` queda protegida: sin push directo, PR
obligatorio y CI en verde para mergear. Aunque el repo sea de una sola
persona, esto es lo que da preview antes de publicar y rollback claro después.

```
git switch -c feat/indice-por-estado
# trabajar, commits pequeños
git push -u origin feat/indice-por-estado
gh pr create
# revisar la preview de Cloudflare
# merge → main → producción
```

**Nombres de rama:** `<tipo>/<descripción-corta-en-kebab>`, mismo vocabulario
que los commits: `feat/`, `fix/`, `refactor/`, `style/`, `chore/`, `docs/`.

**Commits:** Conventional Commits en español, como ya se viene haciendo
(`feat: iconos de github, linkedin y rss en el pie`). Asunto en minúscula, en
imperativo, ≤ 50 caracteres, sin punto final. Cuerpo solo cuando el «por qué»
no sea evidente.

**Merge:** squash. Un PR = un commit en `main`. El historial de `main` se lee
como una lista de cambios, no como un diario de trabajo.

## Definición de terminado

Un PR se puede mergear cuando:

- [ ] `pnpm build` pasa localmente y en CI.
- [ ] `astro check` no reporta errores.
- [ ] La preview se revisó en móvil y en escritorio.
- [ ] No hay enlaces rotos ni placeholders (`CAMBIAR`, `ejemplo.com`, `TODO`).
- [ ] Si se añadió una dependencia, el PR explica por qué.
- [ ] Si se añadió un origen a la CSP, el PR explica por qué.
- [ ] Si cambió una URL pública, hay redirect 301 en `public/_redirects`.
- [ ] Si la decisión contradice `docs/`, el PR también actualiza `docs/`.

## Integración continua

GitHub Actions, en cada PR y en cada push a `main`:

1. `pnpm install --frozen-lockfile`
2. `pnpm exec astro check`
3. `pnpm build`

El build de Cloudflare y el de CI hacen lo mismo a propósito: si CI falla, el
despliegue habría fallado igual, pero se entera antes y sin publicar.

## Rollback

El despliegue no es la parte frágil; el contenido sí. En orden de preferencia:

1. **Rollback en Cloudflare Pages:** en el panel, promover el despliegue
   anterior. Es inmediato y no toca git. Es la opción por defecto ante algo
   roto en producción.
2. **Revertir el commit:** `git revert <sha>` en una rama, PR, merge. Deja
   el historial honesto y vuelve a desplegar solo.

Nunca `push --force` a `main`.

## Dominio y DNS

- `cacharreo.dev` y `www` gestionados en Cloudflare, apuntando al proyecto de
  Pages. `www` redirige al dominio sin `www` (una sola URL canónica).
- HSTS ya está activo con `max-age=31536000; includeSubDomains`: **cualquier
  subdominio futuro tendrá que servir HTTPS obligatoriamente**. Tenerlo en
  cuenta al montar proyectos en subdominios de `cacharreo.dev`.

## Mantenimiento

- **Mensual:** `pnpm outdated`; actualizar parches y menores en un PR
  `chore:` verificando la preview.
- **Mayores de Astro:** PR propio, leyendo la guía de migración. Nunca junto
  con otro cambio.
- **Trimestral:** revisar que los enlaces del índice de proyectos sigan vivos
  y que los estados (`activo` / `pausado` / `archivado`) digan la verdad.
- **Al publicar un escrito:** verificar la preview, la fecha en UTC y que la
  `description` sirva como resumen en redes.
