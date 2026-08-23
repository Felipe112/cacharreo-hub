import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Opcional: de una frase citada no siempre se sabe cuándo se dijo, y es
    // preferible dejarla sin fecha a inventar una. Las que no la tienen se
    // ordenan aparte (ver src/lib/escritos.ts).
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // Solo en las entradas que citan a alguien más. Si faltan, no se muestran.
    autor: z.string().optional(),
    fuente: z.string().optional(),
  }),
});

// Un proyecto es un enlace con contexto. El esquema corre en build: un dato
// mal formado rompe el build, no la página en producción.
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

export const collections = { blog, proyectos };
