import { z } from "zod"

// Validação de CPF
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/

// Validação de telefone brasileiro
const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$|^\d{10,11}$/

// Schema do Cliente
export const clientSchema = z.object({
  cpf: z.string()
    .min(1, "CPF é obrigatório")
    .regex(cpfRegex, "CPF inválido"),
  name: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  rg: z.string()
    .min(5, "RG inválido")
    .max(20, "RG inválido"),
  email: z.string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  phone: z.string()
    .min(1, "Telefone é obrigatório")
    .regex(phoneRegex, "Telefone inválido"),
  birthDate: z.string()
    .min(1, "Data de nascimento é obrigatória")
})

// Schema do Passageiro Adulto
const basePassengerSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  rg: z.string()
    .min(5, "RG inválido")
    .max(20, "RG inválido"),
  birthDate: z.string()
    .min(1, "Data de nascimento é obrigatória")
})

export const adultPassengerSchema = basePassengerSchema.extend({
  type: z.literal("adulto"),
  phone: z.string()
    .min(1, "Telefone é obrigatório")
    .regex(phoneRegex, "Telefone inválido"),
})

// Schema do Passageiro Criança
export const childPassengerSchema = basePassengerSchema.extend({
  type: z.literal("crianca"),
})

// Schema do Passageiro Bebê
export const babyPassengerSchema = basePassengerSchema.extend({
  type: z.literal("bebe"),
})

// Schema unificado de passageiro
export const passengerSchema = z.discriminatedUnion("type", [
  adultPassengerSchema,
  childPassengerSchema,
  babyPassengerSchema
])

// Tipos inferidos dos schemas
export type Client = z.infer<typeof clientSchema>
export type AdultPassenger = z.infer<typeof adultPassengerSchema>
export type ChildPassenger = z.infer<typeof childPassengerSchema>
export type BabyPassenger = z.infer<typeof babyPassengerSchema>
export type Passenger = z.infer<typeof passengerSchema>

// Tipos para bagagem e extras
export interface BaggageOption {
  id: string
  name: string
  weight: string
  price: number
}

export interface ExtraService {
  id: string
  name: string
  description: string
  price: number
}

export interface FareBenefit {
  id: string
  label: string
  description: string
  included: boolean
}

export interface FareBrand {
  id: string
  airline: string
  name: string
  code: string
  price: number
  description: string
  benefits: FareBenefit[]
}

export interface PassengerBaggage {
  passengerId: string
  quantity: number
}

// Tipo para informações do voo
export interface FlightInfo {
  origin: string
  destination: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  flightNumber: string
  airline: string
  basePrice: number
  fareBrandId: string
}

// Tipo para contagem de passageiros vinda do link
export interface PassengerCount {
  adults: number
  children: number
  babies: number
}

// Estado global do formulário
export interface BookingState {
  client: Partial<Client>
  passengers: Passenger[]
  passengerBaggage: PassengerBaggage[]
  selectedExtras: string[]
  flightInfo: FlightInfo
  passengerCount: PassengerCount
}
