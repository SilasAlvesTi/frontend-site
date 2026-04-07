"use client"

import { useEffect, useState } from "react"
import { useBooking } from "@/lib/booking-context"
import { fetchBaggageOptions, fetchFareBrands } from "@/lib/api"
import type { BaggageOption, FareBrand } from "@/lib/schemas"
import { formatCurrency } from "@/lib/utils"
import { PassengerTypeIcon } from "@/components/shared/passenger-type-icon"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Luggage, Sparkles, Check, ChevronDown, Minus, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

const baggageCounterButtonClassName =
  "h-8 w-8 rounded-full border-border bg-muted text-foreground shadow-none hover:bg-secondary hover:text-foreground active:ring-2 active:ring-ring/40 focus-visible:ring-2 focus-visible:ring-ring/40"

export function ExtrasTab() {
  const { state, updatePassengerBaggage, updateFlightInfo, setCanProceed } = useBooking()
  const [baggageOptions, setBaggageOptions] = useState<BaggageOption[]>([])
  const [fareBrands, setFareBrands] = useState<FareBrand[]>([])

  const [openPassengers, setOpenPassengers] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(state.passengers.map(p => [p.id, false]))
  )

  useEffect(() => {
    setCanProceed(true)
    fetchBaggageOptions().then(setBaggageOptions)
    fetchFareBrands().then(setFareBrands)
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

  const availableFareBrands = fareBrands.filter(fareBrand => fareBrand.airline === state.flightInfo.airline)
  const selectedFareBrand = availableFareBrands.find(fareBrand => fareBrand.id === state.flightInfo.fareBrandId)
  const cheapestFareBrand = availableFareBrands.reduce<FareBrand | null>(
    (lowest, fareBrand) => !lowest || fareBrand.price < lowest.price ? fareBrand : lowest,
    null
  )

  const handleFareBrandSelect = (fareBrand: FareBrand) => {
    updateFlightInfo({
      fareBrandId: fareBrand.id,
      basePrice: fareBrand.price,
    })
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
                Tipo de Passagem
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Benefícios incluídos na tarifa escolhida para este voo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid gap-3 sm:gap-4">
            {availableFareBrands.map(fareBrand => {
              const isSelected = fareBrand.id === state.flightInfo.fareBrandId
              return (
                <div
                  key={fareBrand.id}
                  onClick={() => handleFareBrandSelect(fareBrand)}
                  className={cn(
                    "rounded-xl border-2 p-4 sm:p-5 transition-all cursor-pointer",
                    isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-background hover:border-primary/40 hover:bg-secondary/30"
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-base sm:text-lg text-foreground">{fareBrand.name}</p>
                          <Badge
                            variant={isSelected ? "default" : "secondary"}
                            className={isSelected ? "bg-primary text-primary-foreground" : ""}
                          >
                            {isSelected ? "Escolhida" : fareBrand.code}
                          </Badge>
                          {cheapestFareBrand?.id === fareBrand.id && (
                            <Badge variant="secondary">Mais barata</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {fareBrand.airline} • {fareBrand.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base sm:text-lg font-semibold text-foreground">
                          {formatCurrency(fareBrand.price)}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          por passageiro
                        </p>
                        {cheapestFareBrand && fareBrand.price > cheapestFareBrand.price && (
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            +{formatCurrency(fareBrand.price - cheapestFareBrand.price)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2.5">
                      {fareBrand.benefits.map(benefit => (
                        <div
                          key={benefit.id}
                          className={cn(
                            "flex items-start gap-3 rounded-lg border px-3 py-3",
                            benefit.included ? "border-primary/20 bg-primary/5" : "border-border bg-secondary/20"
                          )}
                        >
                          <div
                            className={cn(
                              "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full shrink-0",
                              benefit.included ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {benefit.included ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm sm:text-base font-medium text-foreground">{benefit.label}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-background/70 px-3 py-2">
                      <span className="text-sm text-muted-foreground">
                        {isSelected ? "Tarifa selecionada para esta reserva" : "Clique para escolher esta tarifa"}
                      </span>
                      <div className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full shrink-0 transition-colors",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {availableFareBrands.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma tarifa detalhada foi encontrada para a companhia deste voo.
            </p>
          )}
          {selectedFareBrand && (
            <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
              Tarifa identificada para esta reserva: <span className="font-medium text-foreground">{selectedFareBrand.name}</span>.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
