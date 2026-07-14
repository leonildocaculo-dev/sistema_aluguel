import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  password: z.string().min(6, { message: "A palavra-passe deve ter pelo menos 6 caracteres." }),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  password: z.string().min(8, { message: "A palavra-passe deve ter pelo menos 8 caracteres." }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "Tem de aceitar os termos e condições."
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "As palavras-passe não coincidem.",
  path: ["confirmPassword"],
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
