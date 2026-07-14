import { z } from "zod"

export const bookingSchema = z.object({
  propertyId: z.number(),
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.number().min(1, "A reserva deve ter pelo menos 1 hóspede."),
  specialRequests: z.string().optional(),
}).refine((data) => data.checkOut > data.checkIn, {
  message: "A data de check-out deve ser posterior à data de check-in.",
  path: ["checkOut"],
})

export type BookingFormValues = z.infer<typeof bookingSchema>
