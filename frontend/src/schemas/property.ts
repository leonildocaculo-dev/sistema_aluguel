import { z } from "zod"

export const propertySchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres."),
  description: z.string().min(20, "A descrição deve ser mais detalhada (mínimo 20 caracteres)."),
  type: z.enum(["hotel", "resort", "lodge", "alojamento_local", "bungalow"]),
  location: z.string().min(3, "Introduza uma localização válida."),
  basePrice: z.number().min(0, "O preço não pode ser negativo."),
  amenities: z.array(z.string()).min(1, "Selecione pelo menos uma comodidade."),
  images: z.any().refine((files) => files?.length > 0, "Deve enviar pelo menos uma imagem.")
})

export type PropertyFormValues = z.infer<typeof propertySchema>
