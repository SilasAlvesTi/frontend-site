"use client"

import { useEffect, useState } from "react"
import { useBooking } from "@/lib/booking-context"
import { fetchBaggageOptions, fetchExtraServices } from "@/lib/api"
import type { BaggageOption, ExtraService } from "@/lib/schemas"
import { formatCurrency } from "@/lib/utils"
import { PassengerTypeIcon } from "@/components/shared/passenger-type-icon"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Luggage, Sparkles, Check, ChevronDown, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const baggageCounterButtonClassName =
  "h-8 w-8 rounded-full border-border bg-muted text-foreground shadow-none hover:bg-secondary hover:text-foreground active:ring-2 active:ring-ring/40 focus-visible:ring-2 focus-visible:ring-ring/40"

export function ExtrasTab() {
  const { state, updatePassengerBaggage, toggleExtra, setCanProceed } = useBooking()
  const [baggageOptions, setBaggageOptions] = useState<BaggageOption[]>([])
  const [extraServices, setExtraServices] = useState<ExtraService[]>([])

  const [openPassengers, setOpenPassengers] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(state.passengers.map(p => [p.id, false]))
  )

  useEffect(() => {
    setCanProceed(true)
    fetchBaggageOptions().then(setBaggageOptions)
    fetchExtraServices().then(setExtraServices)
  }, [setCanProceed])

  const bag23Option = baggageOptions.find(option => option.id === "bag-23")

  const getBaggageQuantity = (passengerId: string) => {
    return state.passengerBaggage.find(b => b.passengerId === passengerId)?.quantity ?? 0
  }

  const getSelectedBaggageLabel = (passengerId: string) => {
    const quantity = getBaggageQuantity(passengerId)
    if (!bag23Option || quantity === 0) return "Sem bagagem extra"
    const label = quantity === 1 ? "1 volume" : `${quantity} volumes`
    return `${label} de 23kg - ${formatCurrency(quantity * bag23Option.price)}`
  }

  const togglePassenger = (passengerId: string) => {
    setOpenPassengers(prev => ({ ...prev, [passengerId]: !prev[passengerId] }))
  }

  const changeBaggageQuantity = (passengerId: string, delta: number) => {
    const currentQuantity = getBaggageQuantity(passengerId)
    updatePassengerBaggage(passengerId, Math.max(0, currentQuantity + delta))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-1 pb-4 sm:pb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Luggage className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-2xl font-bold text-foreground">
                Bagagem Extra
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Adicione bagagem extra para cada passageiro
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3">
            {state.passengers.map((passenger, index) => (
              <Collapsible
                key={passenger.id}
                open={openPassengers[passenger.id]}
                onOpenChange={() => togglePassenger(passenger.id)}
              >
                <div className="border border-border rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <PassengerTypeIcon type={passenger.type} />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="font-medium text-sm sm:text-base text-foreground truncate">
                            {passenger.name || `Passageiro ${index + 1}`}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {getSelectedBaggageLabel(passenger.id)}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform shrink-0",
                        openPassengers[passenger.id] && "rotate-180"
                      )} />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border p-3 sm:p-4 bg-secondary/20">
                      <div className="flex items-center justify-between rounded-lg border-2 border-border bg-background p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <Luggage className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm sm:text-base text-foreground">
                              Bagagem 23kg
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {bag23Option ? formatCurrency(bag23Option.price) : "--"} por volume
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className={baggageCounterButtonClassName}
                            onClick={() => changeBaggageQuantity(passenger.id, -1)}
                            disabled={getBaggageQuantity(passenger.id) === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Badge variant="secondary" className="min-w-10 justify-center text-sm">
                            {getBaggageQuantity(passenger.id)}
                          </Badge>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className={baggageCounterButtonClassName}
                            onClick={() => changeBaggageQuantity(passenger.id, 1)}
                            disabled={!bag23Option}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-1 pb-4 sm:pb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-2xl font-bold text-foreground">
                Serviços Adicionais
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Personalize sua experiência de viagem
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {extraServices.map(service => {
              const isSelected = state.selectedExtras.includes(service.id)
              return (
                <div
                  key={service.id}
                  onClick={() => toggleExtra(service.id)}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 sm:gap-4 rounded-lg border-2 p-3 sm:p-4 transition-all",
                    isSelected ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-secondary/50"
                  )}
                >
                  <div className={cn(
                    "flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded border-2 transition-all shrink-0 mt-0.5",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                  )}>
                    {isSelected && <Check className="h-3 w-3 sm:h-4 sm:w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base text-foreground">{service.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                      </div>
                      <Badge className="bg-primary shrink-0 text-xs sm:text-sm">
                        {formatCurrency(service.price)}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
