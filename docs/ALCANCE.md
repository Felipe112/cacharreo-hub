# Alcance

## Propósito

`cacharreo.dev` es el sitio personal de Andrés F. Ceballos. Cumple dos
funciones, en este orden:

1. **Escritos.** Ideas, notas y opiniones pensadas para durar. Es lo que da
   panorama de cómo se piensa y se trabaja. Es el corazón del sitio.
2. **Índice de proyectos.** Un vistazo rápido a lo que existe y un acceso
   directo a cada cosa. Tarjetas con nombre, una línea y un enlace.

Todo lo demás está al servicio de esas dos.

## Público

- Alguien que llega por un escrito o por un proyecto y quiere ver qué más hay.
- Alguien evaluando el trabajo: colegas, clientes, gente contratando.
- Uno mismo, dentro de dos años, buscando el enlace de un proyecto viejo.

## Dentro del alcance

- Portada con hero, índice de proyectos y últimos escritos.
- Listado y detalle de escritos, en Markdown, con RSS. Un escrito puede ser
  texto propio o una cita de alguien más, atribuida con `autor` y `fuente`.
- Índice de proyectos como enlaces externos con estado.
- 404, `robots.txt`, sitemap, cabeceras de seguridad.
- Metadatos sociales (OG / Twitter card) e imagen por defecto.
- Página «Sobre» (fase 2).
- Etiquetas y búsqueda de escritos, ambas estáticas (fase 2).

## Fuera del alcance

Esto no se construye aquí. Si algún día hace falta, es otro repo o una decisión
explícita que actualiza este documento.

| Fuera | Por qué |
|---|---|
| Alojar proyectos, apps o demos dentro del hub | El hub enlaza; cada proyecto tiene su repo y su despliegue |
| SSR, adapter, funciones de servidor, base de datos | El sitio es estático por diseño |
| Comentarios, likes, cuentas de usuario | Moderación y datos personales que no se quieren administrar |
| CMS o panel de administración | El contenido son archivos Markdown en git |
| Formularios de contacto | Requieren backend o un tercero; el correo y las redes ya cubren esto |
| Newsletter | No hay volumen que lo justifique todavía |
| Analítica con cookies o de terceros invasiva | Rompe la promesa de cero terceros |
| Framework de UI (React, Vue, Svelte) | Ninguna pantalla lo necesita |
| Modo claro | La dirección visual «Andino vidrio» es oscura por decisión, no por omisión |

## Diferido con razón explícita

**Página «Apoyar» / donaciones.** Está construida y funciona, pero **sale del
sitio en la fase 0**. Motivo: no existe todavía la cuenta de Ko-fi (el enlace
actual apunta al placeholder `https://ko-fi.com/CAMBIAR`, un enlace roto en
producción) y hay que revisar con calma las implicaciones de pedir dinero
—fiscales y de expectativa frente a quien aporta— antes de publicar un botón
que comprometa a alguien. El código se elimina del sitio; queda registrado en
el historial de git y se recupera cuando la decisión esté tomada. Vuelve en la
fase 3.

**Multi-idioma.** Solo español por ahora. La arquitectura queda preparada para
que activarlo no rompa las URLs actuales (ver `ARQUITECTURA.md` §7). Fase 4.

## Criterio para decir que no

Ante cualquier idea nueva, tres preguntas:

1. ¿Sirve a los escritos o al índice de proyectos? Si no, no entra.
2. ¿Se puede resolver con HTML estático generado en build? Si no, va a otro repo.
3. ¿Alguien tendrá que mantenerlo cada mes? Si sí, probablemente no vale la pena.
