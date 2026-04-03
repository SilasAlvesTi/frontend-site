import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateInput(value: string): string {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
}

export function toISODate(dateStr: string): string {
  const [day, month, year] = dateStr.split("/")
  if (!day || !month || !year || year.length !== 4) return ""
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

export function fromISODate(isoDate: string): string {
  if (!isoDate) return ""
  const [year, month, day] = isoDate.split("-")
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function calculateAge(birthDateISO: string): number {
  if (!birthDateISO) return -1
  const today = new Date()
  const birth = new Date(birthDateISO)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function getAgeError(birthDateISO: string, type: string): string {
  if (!birthDateISO) return ""
  const age = calculateAge(birthDateISO)
  if (type === "crianca") {
    if (age < 2) return "Criança deve ter no mínimo 2 anos. Para menores, use Bebê."
    if (age > 16) return "Criança deve ter no máximo 16 anos. Para maiores, use Adulto."
  }
  if (type === "bebe" && age >= 2) return "Bebê deve ter menos de 2 anos. Para maiores, use Criança."
  return ""
}