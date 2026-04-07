"use client"

import { useEffect, useMemo, useState } from "react"
import { useBooking } from "@/lib/booking-context"
import type { Passenger } from "@/lib/schemas"
import { fromISODate, formatDateInput, toISODate, getAgeError, formatPhone } from "@/lib/utils"
import { PassengerTypeIcon } from "@/components/shared/passenger-type-icon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Phone, IdCard, AlertCircle } from "lucide-react"

function PassengerTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    adulto: "Adulto",
    crianca: "Criança (2-16 anos)",
    bebe: "Bebê (0-2 anos)",
  }
  const colors: Record<string, string> = {
    adulto: "bg-primary text-primary-foreground",
    crianca: "bg-success text-success-foreground",
    bebe: "bg-secondary text-secondary-foreground",
  }
  return <Badge className={colors[type]}>{labels[type]}</Badge>
}

export function PassengersTab() {
  const { state, updatePassenger, setCanProceed } = useBooking()

  const [dateDisplays, setDateDisplays] = useState<Record<string, string>>(() =>
    Object.fromEntries(state.passengers.map(p => [p.id, fromISODate(p.birthDate)]))
  )

  const allPassengersValid = useMemo(() => {
    return state.passengers.length > 0 && state.passengers.every(p => {
      if (!p.name || !p.birthDate || !p.rg) return false
      if (p.type === "adulto" && !p.phone) return false
      return !getAgeError(p.birthDate, p.type)
    })
  }, [state.passengers])

  useEffect(() => {
    setCanProceed(allPassengersValid)
  }, [allPassengersValid, setCanProceed])

  const handleChange = (id: string, field: string, value: string) => {
    updatePassenger(id, { [field]: value } as Partial<Passenger>)
  }

  const handleDateChange = (passengerId: string, value: string) => {
    const formatted = formatDateInput(value)
    setDateDisplays(prev => ({ ...prev, [passengerId]: formatted }))
    if (formatted.length === 10) {
      updatePassenger(passengerId, { birthDate: toISODate(formatted) })
    } else {
      updatePassenger(passengerId, { birthDate: "" })
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 pb-4 sm:pb-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
          Dados dos Passageiros
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Preencha os dados de todos os passageiros do voo
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-4 sm:space-y-6">
          {state.passengers.map((passenger, index) => {
            const ageError = getAgeError(passenger.birthDate, passenger.type)
            return (
              <Card key={passenger.id} className="border border-border">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <PassengerTypeIcon type={passenger.type} className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base sm:text-lg text-foreground">
                        Passageiro {index + 1}
                      </CardTitle>
                    </div>
                    <PassengerTypeBadge type={passenger.type} />
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${passenger.id}`} className="flex items-center gap-2 text-foreground">
                        <PassengerTypeIcon type={passenger.type} className="h-4 w-4 text-primary" />
                        Nome Completo
                      </Label>
                      <Input
                        id={`name-${passenger.id}`}
                        placeholder="Digite o nome completo"
                        value={passenger.name}
                        onChange={e => handleChange(passenger.id, "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`birthDate-${passenger.id}`} className="flex items-center gap-2 text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        Data de Nascimento
                      </Label>
                      <Input
                        id={`birthDate-${passenger.id}`}
                        placeholder="DD/MM/AAAA"
                        value={dateDisplays[passenger.id] || ""}
                        onChange={e => handleDateChange(passenger.id, e.target.value)}
                        maxLength={10}
                        inputMode="numeric"
                        className={ageError ? "border-destructive" : ""}
                      />
                      {ageError && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {ageError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`rg-${passenger.id}`} className="flex items-center gap-2 text-foreground">
                        <IdCard className="h-4 w-4 text-primary" />
                        RG
                      </Label>
                      <Input
                        id={`rg-${passenger.id}`}
                        placeholder="Digite o RG"
                        value={passenger.rg}
                        onChange={e => handleChange(passenger.id, "rg", e.target.value)}
                      />
                    </div>

                    {passenger.type === "adulto" && (
                      <div className="space-y-2">
                        <Label htmlFor={`phone-${passenger.id}`} className="flex items-center gap-2 text-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          Telefone
                        </Label>
                        <Input
                          id={`phone-${passenger.id}`}
                          placeholder="(00) 00000-0000"
                          value={passenger.phone}
                          onChange={e => handleChange(passenger.id, "phone", formatPhone(e.target.value))}
                          maxLength={15}
                          inputMode="tel"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
