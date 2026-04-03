"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import type {
  Client,
  Passenger,
  PassengerBaggage,
  FlightInfo,
  PassengerCount,
  BookingState,
  AdultPassenger,
} from "./schemas"
import { fetchFlightInfo, fetchPassengerCount } from "./api"

interface BookingContextType {
  state: BookingState
  setClient: (client: Partial<Client>) => void
  setPassengers: (passengers: Passenger[]) => void
  updatePassenger: (id: string, data: Partial<Passenger>) => void
  setPassengerBaggage: (baggage: PassengerBaggage[]) => void
  updatePassengerBaggage: (passengerId: string, baggageOptionId: string | null) => void
  setSelectedExtras: (extras: string[]) => void
  toggleExtra: (extraId: string) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  canProceed: boolean
  setCanProceed: (can: boolean) => void
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function createEmptyPassenger(type: "adulto" | "crianca" | "bebe"): Passenger {
  const base = { id: generateId(), name: "", birthDate: "" }
  if (type === "adulto") return { ...base, type: "adulto", rg: "", phone: "" } as AdultPassenger
  return { ...base, type } as Passenger
}

function initPassengers({ adults, children, babies }: PassengerCount): Passenger[] {
  return [
    ...Array.from({ length: adults }, () => createEmptyPassenger("adulto")),
    ...Array.from({ length: children }, () => createEmptyPassenger("crianca")),
    ...Array.from({ length: babies }, () => createEmptyPassenger("bebe")),
  ]
}

const placeholderFlightInfo: FlightInfo = {
  origin: "",
  destination: "",
  departureDate: "",
  departureTime: "",
  arrivalDate: "",
  arrivalTime: "",
  flightNumber: "",
  airline: "",
  basePrice: 0,
}

const placeholderPassengerCount: PassengerCount = {
  adults: 0,
  children: 0,
  babies: 0,
}

const defaultState: BookingState = {
  client: {},
  passengers: [],
  passengerBaggage: [],
  selectedExtras: [],
  flightInfo: placeholderFlightInfo,
  passengerCount: placeholderPassengerCount,
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(defaultState)
  const [currentStep, setCurrentStep] = useState(0)
  const [canProceed, setCanProceed] = useState(false)

  useEffect(() => {
    Promise.all([fetchFlightInfo(), fetchPassengerCount()]).then(([flightInfo, passengerCount]) => {
      setState(prev => ({
        ...prev,
        flightInfo,
        passengerCount,
        passengers: initPassengers(passengerCount),
      }))
    })
  }, [])

  const setClient = useCallback((client: Partial<Client>) => {
    setState(prev => ({ ...prev, client: { ...prev.client, ...client } }))
  }, [])

  const setPassengers = useCallback((passengers: Passenger[]) => {
    setState(prev => ({ ...prev, passengers }))
  }, [])

  const updatePassenger = useCallback((id: string, data: Partial<Passenger>) => {
    setState(prev => ({
      ...prev,
      passengers: prev.passengers.map(p => p.id === id ? { ...p, ...data } as Passenger : p),
    }))
  }, [])

  const setPassengerBaggage = useCallback((baggage: PassengerBaggage[]) => {
    setState(prev => ({ ...prev, passengerBaggage: baggage }))
  }, [])

  const updatePassengerBaggage = useCallback((passengerId: string, baggageOptionId: string | null) => {
    setState(prev => {
      const exists = prev.passengerBaggage.find(b => b.passengerId === passengerId)
      return {
        ...prev,
        passengerBaggage: exists
          ? prev.passengerBaggage.map(b => b.passengerId === passengerId ? { ...b, baggageOptionId } : b)
          : [...prev.passengerBaggage, { passengerId, baggageOptionId }],
      }
    })
  }, [])

  const setSelectedExtras = useCallback((extras: string[]) => {
    setState(prev => ({ ...prev, selectedExtras: extras }))
  }, [])

  const toggleExtra = useCallback((extraId: string) => {
    setState(prev => ({
      ...prev,
      selectedExtras: prev.selectedExtras.includes(extraId)
        ? prev.selectedExtras.filter(id => id !== extraId)
        : [...prev.selectedExtras, extraId],
    }))
  }, [])

  return (
    <BookingContext.Provider value={{
      state,
      setClient,
      setPassengers,
      updatePassenger,
      setPassengerBaggage,
      updatePassengerBaggage,
      setSelectedExtras,
      toggleExtra,
      currentStep,
      setCurrentStep,
      canProceed,
      setCanProceed,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) throw new Error("useBooking must be used within a BookingProvider")
  return context
}