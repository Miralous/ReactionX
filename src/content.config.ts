import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { POSTS_CONFIG } from './config'

const friends = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/data/friends' }),
  schema: z.object({
    name: z.string(),
    url: z.string(),
    author: z.string(),
    description: z.string(),
    avatar: z.string(),
  }),
})

const dynamic = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/data/dynamic' }),
  schema: z.object({
    id: z.string(),
    content: z.string(),
    date: z.string(),
    mood: z.string(),
    link: z.string().nullable(),
  }),
})

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    recommend: z.boolean().default(false),
    author: z.string().default(POSTS_CONFIG.author),
    heroImage: z.string().optional().transform(val => {
      if (!val) return undefined;
      return val.startsWith('http') || val === 'none' ? val : `/hero-images/${val}`;
    }),
    ogImage: z.string().optional().transform(val => {
      if (!val) return undefined;
      return val.startsWith('http') || val === 'none' ? val : `/og-images/${val}`;
    }),
    heroImageLayout: z.string().optional(),
    heroImageAspectRatio: z.string().default(POSTS_CONFIG.defaultHeroImageAspectRatio),
    tags: z.array(z.string()),
    postType: z.string().optional(),
  }),
})

export const collections = { posts, friends, dynamic }