import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const TaskValidationSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
});
