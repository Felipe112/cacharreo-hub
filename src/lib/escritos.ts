import type { CollectionEntry } from 'astro:content';

type Escrito = CollectionEntry<'blog'>;

/**
 * Descarta los borradores y ordena: primero los escritos con fecha, del más
 * nuevo al más viejo; al final los que no tienen, alfabéticos por título.
 *
 * `localeCompare` con `sensitivity: 'base'` evita que un título con acento o
 * en minúscula se vaya al fondo por comparación de bytes.
 *
 * Vive acá y no en cada página porque lo usan la portada, el listado y el RSS:
 * si los tres no ordenan igual, el sitio se contradice.
 */
export function ordenarEscritos(escritos: Escrito[]): Escrito[] {
  const publicados = escritos.filter((e) => !e.data.draft);

  return [
    ...publicados
      .filter((e) => e.data.date)
      .sort((a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0)),
    ...publicados
      .filter((e) => !e.data.date)
      .sort((a, b) => a.data.title.localeCompare(b.data.title, 'es', { sensitivity: 'base' })),
  ];
}
