import { z } from 'zod';

export const signupSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(3, 'Name must be at least 3 characters long')
        .max(30, 'Name must not be more than 30 characters long')
        .trim(),
      email: z.string().email({ message: 'Invalid email address' }).trim(),
      role: z.enum(['user', 'seller']).default('user'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .trim(),
      confirmPassword: z.string().trim(),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['Password confirmation'],
    }),
});

export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string(),
  }),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email({ message: 'Invalid email address' }).trim(),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .trim(),
    })
    .strict(),
});

export const refreshAccessTokenSchema = z.object({
  body: z
    .object({
      refreshToken: z.string(),
    })
    .strict(),
});

export const forgotPasswordSchema = z.object({
  body: z
    .object({
      email: z.string().email({ message: 'Invalid email address' }).trim(),
    })
    .strict(),
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
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['Password confirmation'],
    }),
});

export const updatePasswordSchema = z.object({
  body: z
    .object({
      oldPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .trim(),
      newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .trim(),
      confirmNewPassword: z.string().trim(),
    })
    .strict()
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords don't match",
      path: ['Password confirmation'],
    }),
});
