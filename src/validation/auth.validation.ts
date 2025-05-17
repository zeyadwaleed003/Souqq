import { z } from 'zod';

export const forgotPasswordValidation = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  }),
});

export const resetPasswordValidation = z.object({
  body: z
    .object({
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['Password confirmation'],
    }),
});
