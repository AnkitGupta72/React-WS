import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(80, 'Name is too long')
    .regex(/^[\p{L}\p{N}\s.'-]+$/u, 'Name contains invalid characters'),
});

export const listKindSchema = z.enum(['todo', 'travel', 'shopping']);

export const taskBucketSchema = z.object({
  active: z.array(z.string().trim().min(1).max(500)).max(500),
  completed: z.array(z.string().trim().min(1).max(500)).max(500),
});

export const putListSchema = z.object({
  userId: z.coerce.number().int().positive(),
  bucket: taskBucketSchema,
});
