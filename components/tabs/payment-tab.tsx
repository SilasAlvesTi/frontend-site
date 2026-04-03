"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useBooking } from "@/lib/booking-context"
import { fetchBaggageOptions, fetchExtraServices } from "@/lib/api"
import type { BaggageOption, ExtraService } from "@/lib/schemas"
import { formatCurrency } from "@/lib/utils"
import { PassengerTypeIcon } from "@/components/shared/passenger-type-icon"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plane, Calendar, Clock, Users, Luggage, Sparkles, QrCode, Copy, Check, ArrowRight } from "lucide-react"

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function PaymentTab() {
  const { state } = useBooking()
  const [showQrCode, setShowQrCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [baggageOptions, setBaggageOptions] = useState<BaggageOption[]>([])
  const [extraServices, setExtraServices] = useState<ExtraService[]>([])

  const qrCells = useMemo(
    () => Array.from({ length: 64 }, () => Math.random() > 0.5),
    []
  )

  useEffect(() => {
    fetchBaggageOptions().then(setBaggageOptions)
    fetchExtraServices().then(setExtraServices)
  }, [])

  const pixCode = useRef(
    "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540" +
    Math.floor(Math.random() * 10000).toString().padStart(4, "0") +
    "5802BR5925VA DE AVIAO LTDA6009SAO PAULO62070503***6304"
  ).current

  const calculations = useMemo(() => {
    const ticketsTotal = state.flightInfo.basePrice * state.passengers.length

    const baggageTotal = state.passengerBaggage.reduce((sum, pb) => {
      if (!pb.baggageOptionId || pb.baggageOptionId === "none") return sum
      return sum + (baggageOptions.find(o => o.id === pb.baggageOptionId)?.price ?? 0)
    }, 0)

    const extrasTotal = state.selectedExtras.reduce((sum, extraId) => {
      return sum + (extraServices.find(s => s.id === extraId)?.price ?? 0)
    }, 0)

    return { ticketsTotal, baggageTotal, extrasTotal, total: ticketsTotal + baggageTotal + extrasTotal }
  }, [state, baggageOptions, extraServices])

  const handleCopyPix = async () => {
    await navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-primary p-4 sm:p-6 text-primary-foreground">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Plane className="h-5 w-5 sm:h-6 sm:w-6" />
            <h2 className="text-lg sm:text-xl font-bold">Resumo do Voo</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold">{state.flightInfo.origin.split("(")[1]?.replace(")", "") || "GRU"}</p>
              <p className="text-xs sm:text-sm opacity-90 max-w-20 sm:max-w-none truncate">{state.flightInfo.origin.split("(")[0]?.trim()}</p>
            </div>
            <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
              <div className="flex-1 h-px bg-primary-foreground/30" />
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 mx-1 sm:mx-2 shrink-0" />
              <div className="flex-1 h-px bg-primary-foreground/30" />
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold">{state.flightInfo.destination.split("(")[1]?.replace(")", "") || "GIG"}</p>
              <p className="text-xs sm:text-sm opacity-90 max-w-20 sm:max-w-none truncate">{state.flightInfo.destination.split("(")[0]?.trim()}</p>
            </div>
          </div>
        </div>
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Data</p>
                <p className="font-medium text-sm sm:text-base text-foreground capitalize truncate">{formatDate(state.flightInfo.departureDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Horário</p>
                <p className="font-medium text-sm sm:text-base text-foreground">{state.flightInfo.departureTime} - {state.flightInfo.arrivalTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Plane className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Voo</p>
                <p className="font-medium text-sm sm:text-base text-foreground">{state.flightInfo.flightNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Passageiros</p>
                <p className="font-medium text-sm sm:text-base text-foreground">{state.passengers.length} pessoa(s)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl text-foreground">Detalhamento</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Confira todos os itens da sua compra</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          <div>
            <h4 className="font-medium text-sm sm:text-base text-foreground mb-2">Passagens</h4>
            {state.passengers.map((passenger, index) => (
              <div key={passenger.id} className="flex items-center justify-between py-1.5 sm:py-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <PassengerTypeIcon type={passenger.type} />
                  <span className="text-sm sm:text-base text-foreground truncate">
                    {passenger.name || `Passageiro ${index + 1}`}
                  </span>
                  <Badge variant="secondary" className="capitalize text-[10px] sm:text-xs shrink-0">
                    {passenger.type}
                  </Badge>
                </div>
                <span className="font-medium text-sm sm:text-base text-foreground shrink-0 ml-2">
                  {formatCurrency(state.flightInfo.basePrice)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {calculations.baggageTotal > 0 && (
            <>
              <div>
                <h4 className="font-medium text-sm sm:text-base text-foreground mb-2 flex items-center gap-2">
                  <Luggage className="h-4 w-4 text-primary" />
                  Bagagens Extras
                </h4>
                {state.passengerBaggage
                  .filter(pb => pb.baggageOptionId && pb.baggageOptionId !== "none")
                  .map(pb => {
                    const passenger = state.passengers.find(p => p.id === pb.passengerId)
                    const baggage = baggageOptions.find(o => o.id === pb.baggageOptionId)
                    if (!passenger || !baggage) return null
                    return (
                      <div key={pb.passengerId} className="flex items-center justify-between py-1.5 sm:py-2">
                        <span className="text-sm sm:text-base text-foreground truncate mr-2">
                          {baggage.name} - {passenger.name || "Passageiro"}
                        </span>
                        <span className="font-medium text-sm sm:text-base text-foreground shrink-0">
                          {formatCurrency(baggage.price)}
                        </span>
                      </div>
                    )
                  })}
              </div>
              <Separator />
            </>
          )}

          {state.selectedExtras.length > 0 && (
            <>
              <div>
                <h4 className="font-medium text-sm sm:text-base text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Serviços Adicionais
                </h4>
                {state.selectedExtras.map(extraId => {
                  const service = extraServices.find(s => s.id === extraId)
                  if (!service) return null
                  return (
                    <div key={extraId} className="flex items-center justify-between py-1.5 sm:py-2">
                      <span className="text-sm sm:text-base text-foreground">{service.name}</span>
                      <span className="font-medium text-sm sm:text-base text-foreground shrink-0">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  )
                })}
              </div>
              <Separator />
            </>
          )}

          <div className="flex items-center justify-between pt-3 sm:pt-4">
            <span className="text-lg sm:text-xl font-bold text-foreground">Total</span>
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {formatCurrency(calculations.total)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl text-foreground">Pagamento via PIX</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Escaneie o QR Code ou copie o código para pagar</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {!showQrCode ? (
            <Button
              onClick={() => setShowQrCode(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 sm:h-14 text-base sm:text-lg"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Gerar QR Code PIX
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="bg-background border-4 border-primary rounded-xl p-3 sm:p-4">
                <div className="w-36 h-36 sm:w-48 sm:h-48 bg-foreground rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-0.5 p-1.5 sm:p-2">
                    {qrCells.map((isLight, i) => (
                      <div key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${isLight ? "bg-background" : "bg-foreground"}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-secondary rounded-lg">
                  <div className="flex-1 mr-4">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Valor a pagar:</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      {formatCurrency(calculations.total)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCopyPix}
                  variant="outline"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                >
                  {copied ? (
                    <><Check className="h-4 w-4 mr-2 text-success" />Código copiado!</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-2" />Copiar código PIX</>
                  )}
                </Button>

                <p className="text-center text-xs sm:text-sm text-muted-foreground">
                  Após o pagamento, você receberá a confirmação no e-mail cadastrado.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}