import type { BaggageOption, ExtraService, FareBrand, FlightInfo, PassengerCount } from "./schemas"

type BookingBootstrapPayload = {
  flightInfo: FlightInfo
  passengerCount: PassengerCount
  ancillaryCatalog: {
    baggageOptions: BaggageOption[]
    extraServices: ExtraService[]
  }
  fareBrands: FareBrand[]
}

// ─── Mock de bootstrap da reserva (simula o payload vindo do backend) ────────────
// A ideia aqui é manter as fetches simples como no restante do projeto, mas mostrar
// ao programador um formato próximo do que a API real pode devolver ao carregar a
// reserva já escolhida no app.
const mockBookingBootstrapPayload: BookingBootstrapPayload = {
  flightInfo: {
    origin: "São Paulo (GRU)",
    destination: "Rio de Janeiro (GIG)",
    departureDate: "2026-04-15",
    departureTime: "08:30",
    arrivalDate: "2026-04-15",
    arrivalTime: "09:45",
    flightNumber: "AD1234",
    airline: "Azul",
    basePrice: 450.00,
    fareBrandId: "azul",
  },
  passengerCount: {
    adults: 1,
    children: 1,
    babies: 1,
  },
  ancillaryCatalog: {
    baggageOptions: [
      { id: "none", name: "Sem bagagem extra", weight: "0kg", price: 0 },
      { id: "bag-10", name: "Bagagem 10kg", weight: "10kg", price: 50 },
      { id: "bag-23", name: "Bagagem 23kg", weight: "23kg", price: 100 },
      { id: "bag-32", name: "Bagagem 32kg", weight: "32kg", price: 150 },
    ],
    extraServices: [],
  },
  fareBrands: [
    {
      id: "azul",
      airline: "Azul",
      name: "Tarifa Azul",
      code: "AZUL",
      price: 450.00,
      description: "Opção mais enxuta, com serviços essenciais e complementos contratados à parte.",
      benefits: [
        {
          id: "carry-on",
          label: "Bagagem de mão de até 10kg",
          description: "Inclui 1 bagagem de mão e 1 item pessoal dentro dos limites padrão da companhia.",
          included: true,
        },
        {
          id: "checked-bag",
          label: "Bagagem despachada de 23kg",
          description: "Não incluída na tarifa; contratação separada quando necessário.",
          included: false,
        },
        {
          id: "seat-selection",
          label: "Marcação de assento antecipada",
          description: "Seleção antecipada não incluída; escolha gratuita de assentos padrão fica sujeita à janela de check-in.",
          included: false,
        },
      ],
    },
    {
      id: "mais-azul",
      airline: "Azul",
      name: "Tarifa Mais Azul",
      code: "MAIS AZUL",
      price: 590.00,
      description: "Tarifa com pacote ampliado de serviços para quem quer viajar com mais conveniência.",
      benefits: [
        {
          id: "carry-on",
          label: "Bagagem de mão de até 10kg",
          description: "Inclui 1 bagagem de mão e 1 item pessoal dentro dos limites padrão da companhia.",
          included: true,
        },
        {
          id: "checked-bag",
          label: "1 bagagem despachada de 23kg",
          description: "Franquia de despacho já incluída na tarifa.",
          included: true,
        },
        {
          id: "seat-selection",
          label: "Marcação de assento padrão",
          description: "Seleção de assentos padrão incluída sem custo adicional.",
          included: true,
        },
      ],
    },
  ],
}

// ─── Funções de API (trocar o corpo por fetch quando a API estiver pronta) ───────

export async function fetchFlightInfo(): Promise<FlightInfo> {
  // return fetch("/api/booking/bootstrap").then(r => r.json()).then(data => data.flightInfo)
  return mockBookingBootstrapPayload.flightInfo
}

export async function fetchPassengerCount(): Promise<PassengerCount> {
  // return fetch("/api/booking/bootstrap").then(r => r.json()).then(data => data.passengerCount)
  return mockBookingBootstrapPayload.passengerCount
}

export async function fetchBaggageOptions(): Promise<BaggageOption[]> {
  // return fetch("/api/booking/bootstrap").then(r => r.json()).then(data => data.ancillaryCatalog.baggageOptions)
  return mockBookingBootstrapPayload.ancillaryCatalog.baggageOptions
}

export async function fetchExtraServices(): Promise<ExtraService[]> {
  // return fetch("/api/booking/bootstrap").then(r => r.json()).then(data => data.ancillaryCatalog.extraServices)
  return mockBookingBootstrapPayload.ancillaryCatalog.extraServices
}

export async function fetchFareBrands(): Promise<FareBrand[]> {
  // return fetch("/api/booking/bootstrap").then(r => r.json()).then(data => data.fareBrands)
  return mockBookingBootstrapPayload.fareBrands
}
