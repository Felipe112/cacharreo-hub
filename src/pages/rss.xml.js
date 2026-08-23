import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { ordenarEscritos } from '../lib/escritos';

export async function GET(context) {
  const posts = ordenarEscritos(await getCollection('blog'));

  // Idioma del sitio. Cuando llegue la fase 4 habrá un feed por idioma y esto
  // sale del locale, no de una constante acá.
  const idioma = 'es';
  const self = new URL('rss.xml', context.site);

  return rss({
    title: 'cacharreo.dev',
    // Describe lo que hay en el feed, que son escritos. Los proyectos no
    // entran acá: viven en el índice de la portada.
    description:
      'Los escritos de cacharreo.dev: notas sobre lo que armo y citas que valió la pena guardar.',
    site: context.site,
    // Misma URL canónica que el listado: sin barra final.
    trailingSlash: false,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    // `atom:link rel="self"` es lo que permite a un lector saber de dónde se
    // sirve el feed si se lo pasan por otro lado; sin él, el validador del W3C
    // avisa. `language` no lo expone la integración, así que va por acá.
    customData: [
      `<language>${idioma}</language>`,
      `<atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      ...(post.data.date && { pubDate: post.data.date }),
      link: `/blog/${post.id}`,
    })),
  });
}
