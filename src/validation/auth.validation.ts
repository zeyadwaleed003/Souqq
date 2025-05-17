import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .max(30, 'Name must not be more than 30 characters long')
      .trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .trim(),
    confirmPassword: z.string().trim(),
  }),
});

export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .trim(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }).trim(),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string(),
  }),
  body: z
    .object({
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .trim(),
      confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['Password confirmation'],
    }),
});
