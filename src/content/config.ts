import { defineCollection, z } from 'astro:content'

const engineeringCollection = defineCollection({
    schema: ({ image }) => z.object({
        title: z.string().min(1, 'Title is required.'),
        description: z.string().optional(),
        date: z.date(),
        image: image(),
        categories: z.string().array().optional(),
        repo: z.string().min(1, 'Repo is required.')
    }),
})

const writingCollection = defineCollection({
    schema: ({ image }) => z.object({
        title: z.string().min(1, 'Title is required.'),
        description: z.string().optional(),
        date: z.date(),
        image: image(),
        categories: z.string().array().optional(),
        src: z.string().min(1, 'Source is required.')
    }),
})

export const collections = {
    engineering: engineeringCollection,
    writing: writingCollection,
}