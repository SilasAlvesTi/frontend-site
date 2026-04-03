import type { BaggageOption, ExtraService, FlightInfo, PassengerCount } from "./schemas"

// ─── Dados mock (substituir pelo corpo das funções quando a API estiver pronta) ───

const mockFlightInfo: FlightInfo = {
  origin: "São Paulo (GRU)",
  destination: "Rio de Janeiro (GIG)",
  departureDate: "2026-04-15",
  departureTime: "08:30",
  arrivalDate: "2026-04-15",
  arrivalTime: "09:45",
  flightNumber: "VA1234",
  airline: "Vá de Avião",
  basePrice: 450.00,
}

const mockPassengerCount: PassengerCount = {
  adults: 2,
  children: 1,
  babies: 0,
}

const mockBaggageOptions: BaggageOption[] = [
  { id: "none", name: "Sem bagagem extra", weight: "0kg", price: 0 },
  { id: "bag-10", name: "Bagagem 10kg", weight: "10kg", price: 50 },
  { id: "bag-23", name: "Bagagem 23kg", weight: "23kg", price: 100 },
  { id: "bag-32", name: "Bagagem 32kg", weight: "32kg", price: 150 },
]

const mockExtraServices: ExtraService[] = [
  { id: "seat-selection", name: "Escolha de Assento", description: "Selecione seu assento preferido no avião", price: 35 },
  { id: "priority-boarding", name: "Embarque Prioritário", description: "Seja um dos primeiros a embarcar", price: 45 },
  { id: "travel-insurance", name: "Seguro Viagem", description: "Proteção completa durante toda a viagem", price: 80 },
  { id: "meal", name: "Refeição a Bordo", description: "Refeição completa durante o voo", price: 60 },
  { id: "lounge", name: "Acesso ao Lounge", description: "Acesso à sala VIP do aeroporto", price: 120 },
]

// ─── Funções de API (trocar o corpo por fetch quando a API estiver pronta) ───────

export async function fetchFlightInfo(): Promise<FlightInfo> {
  // return fetch("/api/flight").then(r => r.json())
  return mockFlightInfo
}

export async function fetchPassengerCount(): Promise<PassengerCount> {
  // return fetch("/api/booking/passengers").then(r => r.json())
  return mockPassengerCount
}

export async function fetchBaggageOptions(): Promise<BaggageOption[]> {
  // return fetch("/api/baggage-options").then(r => r.json())
  return mockBaggageOptions
}

export async function fetchExtraServices(): Promise<ExtraService[]> {
  // return fetch("/api/extra-services").then(r => r.json())
  return mockExtraServices
}
