"use client"

import { BookingProvider, useBooking } from "@/lib/booking-context"
import { Stepper } from "@/components/stepper"
import { ClientTab } from "@/components/tabs/client-tab"
import { PassengersTab } from "@/components/tabs/passengers-tab"
import { ExtrasTab } from "@/components/tabs/extras-tab"
import { PaymentTab } from "@/components/tabs/payment-tab"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Plane } from "lucide-react"

function BookingContent() {
  const { currentStep, setCurrentStep, canProceed, state } = useBooking()

  const handleNext = () => {
    if (currentStep < 3 && canProceed) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
    }
  }

  const renderCurrentTab = () => {
    switch (currentStep) {
      case 0:
        return <ClientTab />
      case 1:
        return <PassengersTab />
      case 2:
        return <ExtrasTab />
      case 3:
        return <PaymentTab />
      default:
        return <ClientTab />
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Vá de Avião"
                className="h-8 sm:h-10 w-auto"
              />
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Plane className="h-4 w-4 text-primary" />
              <span>{state.flightInfo.origin}</span>
              <ArrowRight className="h-3 w-3" />
              <span>{state.flightInfo.destination}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto">
          <Stepper currentStep={currentStep} onStepClick={handleStepClick} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-1 w-full">
        {renderCurrentTab()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6 sm:mt-8 gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-1.5 sm:gap-2 h-10 sm:h-11 text-sm sm:text-base px-3 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>

          {currentStep < 3 && (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="gap-1.5 sm:gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-10 sm:h-11 text-sm sm:text-base px-4 sm:px-6"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-auto">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <p>2026 Vá de Avião. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function BookingPage() {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  )
}
